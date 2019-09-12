import React, { useEffect, useRef } from 'react';
import FilterFooter from './FilterFooter';
import { array, arrayOf, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';
import { mergeClasses } from '../../classify';
import { X as CloseIcon } from 'react-feather';
import Icon from '../Icon';
import FilterBlock from './filterBlock';
import FiltersCurrent from './FiltersCurrent';
import defaultClasses from './filterModal.css';
import { Modal } from '../Modal';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [, catalogApi] = useCatalogContext();
    const { setToApplied } = catalogApi;
    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = drawer === 'filter' ? classes.rootOpen : classes.root;

    // If the user closes the drawer without clicking "Apply filters" we need to
    // make sure we reset to the last applied filters (url param values).
    const prevDrawer = useRef(null);
    useEffect(() => {
        if (prevDrawer.current === 'filter' && drawer === null) {
            setToApplied();
        }
        prevDrawer.current = drawer;
    }, [drawer, setToApplied]);

    return (
        <Modal>
            <aside className={modalClass}>
                <div className={classes.modalWrapper}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>FILTER BY</span>
                        <button onClick={closeDrawer}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>

                    <FiltersCurrent keyPrefix="modal" />

                    <List
                        items={filters}
                        getItemKey={({ request_var }) => request_var}
                        render={renderProps => (
                            <ul className={classes.filterOptionsContainer}>
                                {renderProps.children}
                            </ul>
                        )}
                        renderItem={renderProps => (
                            <FilterBlock item={renderProps.item} />
                        )}
                    />
                </div>
                <FilterFooter />
            </aside>
        </Modal>
    );
};

FilterModal.propTypes = {
    classes: shape({
        root: string,
        modalWrapper: string,
        header: string,
        headerTitle: string,
        filterOptionsContainer: string
    }),
    filters: arrayOf(
        shape({
            request_var: string,
            items: array
        })
    )
};

export default FilterModal;
