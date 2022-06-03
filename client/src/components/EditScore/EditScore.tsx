import { ChangeEvent, SyntheticEvent } from 'react'

import { FormControlFlow } from '../Scores/Scores'
import * as sharedStyles from '../sharedStyles'
import * as styles from './EditScoreStyles'


interface EditScoreProps {
    formControl: FormControlFlow
    handleInputChange: (event: ChangeEvent<HTMLInputElement>, typeChanged?: 'initials') => void
    handleModalToggle: () => void
    handleOnSubmit: (event: SyntheticEvent) => void
}


const EditScore = ({ formControl, handleInputChange, handleModalToggle, handleOnSubmit }: EditScoreProps) => {
    return (
        <div className={styles.scoreModalWrapper}>
            <div>
                <button onClick={handleModalToggle} className={styles.closeModalButton} aria-label='Close modal'>
                    X
                </button>
                <h1 className={sharedStyles.heading}>Add your score</h1>
                <form onSubmit={handleOnSubmit}>
                    <label
                        className={formControl.areFormInitialsTouched && formControl.initials.trim() === '' ? sharedStyles.errorLabel : ''}
                        htmlFor='addInitials'
                    >
                        Enter your initials
                        <input
                            className={styles.inputInitials}
                            id='addInitials'
                            maxLength={3}
                            onChange={(event) => handleInputChange(event, 'initials')}
                            type='text'
                            value={formControl.initials}
                        />

                        {formControl.areFormInitialsTouched && formControl.initials.trim() === '' && <p>Initials are required</p>}
                    </label>
                    <label
                        className={formControl.isFormScoreTouched && formControl.score.trim() === '' ? sharedStyles.errorLabel : ''}
                        htmlFor='addScore'
                    >
                        Enter your score
                        <input
                            id='addScore'
                            onChange={(event) => handleInputChange(event)}
                            type='number'
                            value={formControl.score}
                        />

                        {formControl.isFormScoreTouched && formControl.score.trim() === '' && <p>Score is required</p>}
                    </label>
                    <input type='submit' value='Submit' />
                </form>
            </div>
        </div>
    )
}

export default EditScore
