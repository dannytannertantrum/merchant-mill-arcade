import { SyntheticEvent } from "react"

const AddGamePage = () => {
    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <label>
                Enter a title
                <input type='text' />
            </label>
            {
                //
                // Pull in image search API and search based off the title
            }
            <input type='submit' value='Submit' />
        </form>
    )
}

export default AddGamePage
