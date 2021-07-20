
function findEmails(){
    let emails = document.querySelectorAll('a[href^="mail"]')
    
    let domains = {}
    let emailCount = 0
    let emailList = []


    for (let i of emails){
        try {
            let email = i.href.toLowerCase().split(':')[1]
            email = email.split('?')[0]
            let [username, domain] = email.split('@')
            
            !(domain in domains) && (domains[domain] = [])
            
            // prevent duplicates
            if (!domains[domain].includes(username)){
                domains[domain].push(username)
                emailCount += 1
                emailList.push(email)
            } 
        }
        catch {/* dang */}
    }

    console.log(`Domains: ${Object.keys(domains).length} \nTotal Emails: ${emailCount}`)



    
    chunkEmails(emailList)
}




function chunkEmails(emailList, i=0){
    const chunkSize = 12
    const chunkCount = Math.ceil(emailList.length/chunkSize)

    const start = i * chunkSize
    const end = start + chunkSize
    const chunk = emailList.slice(start,end)
    const path = window.location.href.split('?')[0]
    
    console.log('path',path)

    saveEmails(path, chunk)

    ++i < chunkCount && setTimeout(()=>chunkEmails(emailList, i), 30)
}








function saveEmails(path, emails){
    let myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    let raw = JSON.stringify({
        "path": path,
        "emails": emails
    })
    
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    console.log('Saving some emails...')
    fetch("https://5aijchuyn4.execute-api.us-east-1.amazonaws.com/prod/post-email", requestOptions)
    .then(r => r.json())
    .then(r => {

        const success = JSON.stringify(r) === '{"UnprocessedItems":{}}'

        if(!success){
            // retry submission
            // bad solution, but it'll do for now
            if ('UnprocessedItems' in r){
                console.log('resending request')
                setTimeout(()=>saveEmails(path, emails), 100)
            }
        }
    })
}





window.onload = function() {
	console.log('Looking for emails...')
    chrome.storage.sync.get(['key'], function(result) {
        console.log('Value currently is ' + result.key)
    })
    findEmails()
}