import { LazyLoadEvent } from 'primeng/api'; // Assuming you're importing from PrimeNG

/**
 * Represents a custom event object for lazy loading data with additional pagination and sorting fields.
 * Extends the PrimeNG LazyLoadEvent interface.
 * @group Interface
*/
export interface CustomLazyLoadEvent extends LazyLoadEvent {
    /**
     * The zero-based index of the current page (for pagination).
     */
    page?: number;

    /**
     * The number of rows to load per page (for pagination).
     */
    page_size?: number;

    /**
     * An optional string representing the desired sorting order (e.g., "field1 ASC, field2 DESC").
     */
    ordering?: string;
}
