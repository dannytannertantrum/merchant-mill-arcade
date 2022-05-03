const constructSlug = (title: string): string => {
    title = title.trim().toLowerCase()

    // remove accents, swap ñ for n, etc
    let from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    let to = 'aaaaeeeeiiiioooouuuunc------'
    for (let i = 0, l = from.length; i < l; i++) {
        title = title.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    title = title.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes

    return title
}

const textInputCleanUpWhitespace = (textInput: string | undefined): string | undefined => {
    return textInput?.trim().replace(/\s+/g, ' ')
}

export {
    constructSlug,
    textInputCleanUpWhitespace
}
