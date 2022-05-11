interface Disposable<T> {
    data: T
    cleanUp: () => Promise<void>
}

const disposeAll = async <T>(disposables: Disposable<T>[]): Promise<void> => {
    await Promise.all(disposables.map(d => d.cleanUp()))
}

export {
    Disposable,
    disposeAll
}
