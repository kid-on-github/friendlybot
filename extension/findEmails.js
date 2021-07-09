
function findEmails(){
    let emails = document.querySelectorAll('a[href^="mail"]')
    
    let domains = {}
    let emailCount = 0
    
    for (let i of emails){
        try {
            let email = i.href.toLowerCase().split(':')[1]
            let [username, domain] = email.split('@')
            
            !(domain in domains) && (domains[domain] = [])

            domains[domain].push(username)
            emailCount += 1
        }
        catch {/* dang */}
    }

    console.log(`Domains: ${Object.keys(domains).length} \nTotal Emails: ${emailCount}`)

}





window.onload = function() {
	console.log('Looking for emails...')
    findEmails()
}