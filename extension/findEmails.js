
function findEmails(){
    let emails = document.querySelectorAll('a[href^="mail"]')
    
    let domains = {}
    let emailCount = 0
    let emailList = []


    for (let i of emails){
        try {
            let email = i.href.toLowerCase().split(':')[1]
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
    const chunkSize = 8
    const chunkCount = Math.ceil(emailList.length/chunkSize)

    const start = i * chunkSize
    const end = start + chunkSize
    const chunk = emailList.slice(start,end)
    
    saveEmails(window.location.href, chunk)

    ++i < chunkCount && setTimeout(()=>chunkEmails(emailList, i), 20)
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
        // mode: 'no-cors',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }

    console.log('Saving some emails...')
    fetch("https://93le4evhyh.execute-api.us-east-1.amazonaws.com/prod/hello", requestOptions)
    .then(r => r.json())
    .then(r => {

        const success = JSON.stringify(r) === '{"UnprocessedItems":{}}'

        if(!success){
            console.log(r)
            console.log(emails)
        }
    })
}





window.onload = function() {
	console.log('Looking for emails...')
    findEmails()
}