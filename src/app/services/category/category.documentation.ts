// Documentation for Category API and DTOs

/**
 * CategoryDto: Used for creating and updating categories.
 * @property id? - number (optional, for update)
 * @property name - string
 * @property description? - string
 * @property isActive? - boolean
 */

/**
 * CategoryFullDto: Used for full category details.
 * @property id - number
 * @property name - string
 * @property description? - string
 * @property isActive - boolean
 * // Add any additional fields returned by the backend
 */

/**
 * CategoryService methods:
 * - create(dto: CategoryDto): Observable<any>
 * - update(id: number, dto: CategoryDto): Observable<any>
 * - deactivate(id: number): Observable<any>
 * - delete(id: number): Observable<void>
 * - getAllByIsActive(isActive: boolean): Observable<CategoryDto[]>
 * - getByIsActive(isActive: boolean): Observable<CategoryDto>
 * - getAllCategoriesFull(): Observable<CategoryFullDto[]>
 */
