export const dateType = (data) => {
    const date = data.split('-')[2]
    const month = data.split('-')[1]
    const year = data.split('-')[0]
    return `${date}.${month}.${year}`
}