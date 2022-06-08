import { ChangeEvent, Fragment, SyntheticEvent, useState } from 'react'

import { ScoreFormControlFlow } from '../Scores/Scores'
import * as sharedStyles from '../sharedStyles'
import * as styles from './EditScoreStyles'


interface EditScoreProps {
    formControl: ScoreFormControlFlow
    handleInputChange: (event: ChangeEvent<HTMLInputElement>, typeChanged?: 'initials') => void
    handleCloseModalToggle: (event: SyntheticEvent, index: number) => void
    handleDelete: (event: SyntheticEvent, scoreId: string) => void
    handleOnSubmitCreate: (event: SyntheticEvent) => void
    handleOnSubmitEdit: (event: SyntheticEvent) => void
    scoreUnchanged: {
        initials: string
        score: string
    }
}

const EditScore = ({
    formControl,
    handleInputChange,
    handleCloseModalToggle,
    handleDelete,
    handleOnSubmitCreate,
    handleOnSubmitEdit,
    scoreUnchanged
}: EditScoreProps) => {

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)


    const handleCancelDeleteClicked = (event: SyntheticEvent) => {
        // We need this to prevent the button from trying to submit the form
        event.preventDefault()

        setShowDeleteConfirmation(!showDeleteConfirmation)
    }

    const heading = (
        formControl.editingScore
            ? <Fragment>Edit score for <span className={sharedStyles.highlight}>{scoreUnchanged.initials}</span></Fragment>
            : 'Add your score'
    )

    const submitButtons = (
        formControl.editingScore
            ? (
                <div className={styles.editSubmitButtonsWrapper}>
                    <input type='submit' value='Update Score' />
                    <button className={sharedStyles.deleteButton} onClick={(event) => handleCancelDeleteClicked(event)}>Delete Score</button>
                </div>
            ) : <input type='submit' value='Submit' />
    )


    return (
        <div className={styles.scoreModalWrapper}>
            <div>
                <h1 className={sharedStyles.heading}>{heading}</h1>
                <form onSubmit={formControl.editingScore ? handleOnSubmitEdit : handleOnSubmitCreate}>
                    <label
                        className={formControl.areFormInitialsTouched && formControl.initials.trim() === '' ? sharedStyles.errorLabel : ''}
                        htmlFor='addInitials'
                    >
                        Enter your initials
                        <input
                            autoFocus
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
                    {!showDeleteConfirmation && submitButtons}
                </form>

                {/* Take the following elements out of the form so our buttons do not trigger submission */}
                {showDeleteConfirmation &&
                    <Fragment>
                        <p className={styles.deleteConfirmation}>Are you sure you want to delete the score
                            <span className={sharedStyles.highlight}> {scoreUnchanged.score}</span> by
                            <span className={sharedStyles.highlight}> {scoreUnchanged.initials}</span>?
                        </p>
                        <div className={styles.editSubmitButtonsWrapper}>
                            <button
                                className={sharedStyles.deleteButton}
                                onClick={(event) => handleDelete(event, formControl.scoreId)}
                            >
                                Yes, Delete
                            </button>
                            <button className={sharedStyles.cancelDeleteButton} onClick={(event) => handleCancelDeleteClicked(event)}>Cancel</button>
                        </div>
                    </Fragment>
                }
                <button
                    aria-label='Close modal'
                    className={styles.closeModalButton}
                    onClick={(event) => handleCloseModalToggle(event, formControl.index)}
                >
                    X
                </button>
            </div>
        </div>
    )
}

export default EditScore
