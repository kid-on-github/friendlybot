
function findEmails(){
    let emails = document.querySelectorAll('a[href^="mail"]')
    
    let domains = {}
    let emailCount = 0
    let emailList = []


    for (let i of emails){
        try {
            let email = i.href.toLowerCase().split(':')[1]
            emailList.push(email)
            let [username, domain] = email.split('@')
            
            !(domain in domains) && (domains[domain] = [])

            domains[domain].push(username)
            emailCount += 1
        }
        catch {/* dang */}
    }

    console.log(`Domains: ${Object.keys(domains).length} \nTotal Emails: ${emailCount}`)



    const chunkSize = 8
    let x = Math.ceil(emailList.length/chunkSize)

    for (let i=0; i<x; i++){
        const start = i * chunkSize
        const end = start + chunkSize
        const chunk = emailList.slice(start,end)
        console.log('chunk',chunk)

        saveEmails(window.location.href, chunk)
    }
}




function saveEmails(path, emails){
    console.log('Saving emails...')
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

    fetch("https://fk49x1g7a3.execute-api.us-east-1.amazonaws.com/prod/hello", requestOptions)
    .then(r => r.text())
    .then(r => console.log(r))
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error))
}





window.onload = function() {
	console.log('Looking for emails...')
    findEmails()
}