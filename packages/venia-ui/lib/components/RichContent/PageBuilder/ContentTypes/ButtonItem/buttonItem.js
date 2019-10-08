import React, { useEffect, useRef, useState, useCallback } from 'react';
import Button from '../../../../Button/button';
import { arrayOf, oneOf, string, bool, object } from 'prop-types';
import { withRouter } from '@magento/venia-drivers';
import resolveLinkProps from '../../resolveLinkProps';
import { compose } from 'redux';

/**
 * Page Builder ButtonItem component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef ButtonItem
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a button.
 */
const ButtonItem = props => {
    const {
        buttonType,
        link,
        linkType,
        openInNewTab = false,
        text,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        renderCallback
    } = props;

    const [minWidth, setMinWidth] = useState(0);

    const dynamicInnerStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        minWidth
    };

    const ref = useRef();

    let linkProps = {};
    let url = '';
    if (typeof link === 'string') {
        linkProps = resolveLinkProps(link, linkType);
        url = linkProps.to ? linkProps.to : linkProps.href;
    }

    const typeToPriorityMapping = {
        primary: 'high',
        secondary: 'normal',
        link: 'low'
    };

    useEffect(() => {
        if (typeof renderCallback === 'function') {
            const width = ref.current.childNodes[0].offsetWidth;
            renderCallback(width, minWidth => {
                setMinWidth(minWidth);
            });
        }
    }, [minWidth, renderCallback]);

    const handleClick = useCallback(() => {
        if (!url) {
            return;
        }

        if (openInNewTab) {
            window.open(url, '_blank');
        } else {
            props.history.push(url);
        }
    }, [openInNewTab, props.history, url]);

    const justifyMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
    };
    if (textAlign) {
        dynamicInnerStyles.justifyContent = justifyMap[textAlign] || 'center';
        dynamicInnerStyles.textAlign = textAlign;
    }

    return (
        <div
            ref={ref}
            className={cssClasses.length ? cssClasses.join(' ') : undefined}
        >
            <Button
                priority={typeToPriorityMapping[buttonType]}
                type="button"
                onClick={handleClick}
                style={dynamicInnerStyles}
            >
                {text}
            </Button>
        </div>
    );
};

/**
 * Props for {@link ButtonItem}
 *
 * @typedef props
 *
 * @property {String} buttonType Sets button type option
 * @property {String} link Url to the page opened when button clicked
 * @property {String} linkType Type of the linked page
 * @property {String} openInNewTab Toggles the option to open linked page in the new tab
 * @property {String} text Button text
 * @property {String} textAlign Button text align
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {Object} history User browsing history from withRouter function
 */
ButtonItem.propTypes = {
    buttonType: oneOf(['primary', 'secondary', 'link']),
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    text: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string),
    history: object
};

export default compose(withRouter)(ButtonItem);
