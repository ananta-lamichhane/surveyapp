
import fetch from "node-fetch"


  async function checkAPIAlive(){
    const API_URL = process.env.REACT_APP_API_URL+'/survey'
     var resp = await fetch(process.env.REACT_APP_API_URL+'/survey')
    var json_data = resp.json()
    console.log("hello")
    return -1
    

  }

  
  test('the shopping list has milk on it', () => {
    expect(checkAPIAlive().toEqual(-1))
  });