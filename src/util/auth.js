export const authMiddleWare = (history) => {
    const authToken = localStorage.getItem('AuthToken');
    console.log(`Printing out auth token ${authToken}`)
    if(authToken === null){
        history.push('/login')
    }
}