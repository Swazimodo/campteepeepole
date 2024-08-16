export const randomSuccessOrFailure = (value?: any) => {
  console.log(`mock api call with: ${value}`)
  return new Promise((resolve, reject) => {
    if (Math.random() >= .5) {
      resolve({ responseCode: 200, message: "success" })
    }
    else {
      reject({ responseCode: 404, message: "not found" })
    }
  })
}

export const willSucceed = (value?: any) => {
  console.log(`mock api call with: ${value}`)
  return Promise.resolve({ responseCode: 200, message: "success" })
}

export const willFail = (value?: any) => {
  console.log(`mock failing api call with: ${value}`)
  return Promise.reject({ responseCode: 404, message: "not found" })
}
