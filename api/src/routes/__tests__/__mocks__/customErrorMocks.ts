import * as customErrors from '../../../custom-errors'


const mockHandleApiError = jest.spyOn(customErrors, 'handleApiError')
const mockHandleDuplicateEntryError = jest.spyOn(customErrors, 'handleDuplicateEntryError')
const mockHandleNotFoundError = jest.spyOn(customErrors, 'handleNotFoundError')
const mockHandleValidationError = jest.spyOn(customErrors, 'handleValidationError')

export {
    mockHandleApiError,
    mockHandleDuplicateEntryError,
    mockHandleNotFoundError,
    mockHandleValidationError
}
