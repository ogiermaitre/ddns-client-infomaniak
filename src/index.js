const { flatMap, startWith } = require('rxjs/operators')
const { interval, from } = require('rxjs')
const fetch = require('node-fetch')

const {timeFormat} = require('d3-time-format')

const user = process.env.USER
const password = process.env.PASSWORD
const domain = process.env.DOMAIN
const period = process.env.INTERVAL || 60000

const format = timeFormat("%Y-%m-%d %H:%M")

let currentIp

const getIp = () => {
    return fetch('https://ifconfig.co/json', { Accept: 'application/json' })
        .then(d => d.json())
        .then(d => d.ip)
}


const updateIp = ip => {
    const url = `https://${user}:${password}@infomaniak.com/nic/update?hostname=${domain}&myip=${ip}`
    fetch(url, { method: 'POST' })
        .then(d=>{
            if( d.status!==200){
                console.log(d)
                throw new Error('Error while requesting ip update')
            }
        })
}

const intervalStream = interval(period,0)
    .pipe(
        startWith(0),
        flatMap(() => from(getIp()))
    )


intervalStream.subscribe(x => {
    if (currentIp !== x) {
        const now = new Date()

        console.log(`${format(now)}: new ip ${x}`)
        currentIp = x
        updateIp(x)
    }
});