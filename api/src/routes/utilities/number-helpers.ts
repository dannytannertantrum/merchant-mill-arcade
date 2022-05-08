const sanitizeScore = (numberInput: number | undefined): number | undefined => {
    if (numberInput != null && !isNaN(numberInput) && numberInput >= 0) {
        return Math.round(numberInput)
    }

    return undefined
}

export {
    sanitizeScore
}
