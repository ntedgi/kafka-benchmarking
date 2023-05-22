
const functionTimeWrapper = async ({ fn, fnArgument }) => {
    const startTime = process.hrtime();
    const result = await fn(...fnArgument)
    const endTime = process.hrtime(startTime);
    const duration = endTime[0] * 1000 + endTime[1] / 1e6
    return {
        result,
        duration
    }
}


const testFn = (a, b, c, d) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(a)
            console.log(b)
            console.log(c)
            console.log(d)
            resolve()
        }, 500)
    })
}


module.exports = { functionTimeWrapper }