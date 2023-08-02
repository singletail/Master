
const utils = {
    inArr: (arr, val) => {
        const length = arr.length
        for (var num = 0; num < length; num++) {
            if (arr[num] === val) return true
        }
    }

}

export default utils
