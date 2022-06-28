import * as customErrors from '../../../utilities/custom-errors'


const mockHandleError = jest.spyOn(customErrors, 'handleError')
const mockHandleApiError = jest.spyOn(customErrors, 'handleApiError')
const mockHandleDuplicateEntryError = jest.spyOn(customErrors, 'handleDuplicateEntryError')
const mockHandleNotFoundError = jest.spyOn(customErrors, 'handleNotFoundError')
const mockHandleValidationError = jest.spyOn(customErrors, 'handleValidationError')

export {
    mockHandleError,
    mockHandleApiError,
    mockHandleDuplicateEntryError,
    mockHandleNotFoundError,
    mockHandleValidationError
}
