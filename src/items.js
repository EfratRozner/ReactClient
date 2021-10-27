import react, { useState, useEffect } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';


function Items() {
    // 
    const [item, setItem] = useState([]);
    const [ok, setOk] = useState(true);
    const [act, setAct] = useState(false);

    let newPrice = 0
    
    ///שמירת מס האחוזים שהמשתמש הקליד לעדכון  המחיר  
    const change = (e) => {
         newPrice = e
    }
    
    //פונקציית העדכון
    const change2 = (it) => {
        // שליחת המזהה של המוצר +בכמה אחוזים לשנות
       axios.put(`https://localhost:44396/api/sweets/UpdateItems/${it.id}/${newPrice}`)
        .then((d) => {
           setItem(d.data)
        })
    }
  // פונקציות עזר 
    const funk = (event) => {
        event.preventDefault();
        setOk(false);
     
    }
   const not = () => {
    setAct(true);

    }
    ///  לשליפת הנתונים מהשרת get
    useEffect(() => {
        axios.get('https://localhost:44396/api/Sweets/GetAllItems')
            .then((d) => {
                console.log(d.data)
                setItem(d.data)
            })
    }, [])
    //קריאות לפונקציות של החיפושים לפי
    const findId=(event)=>{
        axios.get(`https://localhost:44396/api/Sweets/findById/${event}`)
        .then((d) => {
            console.log(d.data)
            setItem(d.data)
        })
    }
    const findName=(event)=>{
        axios.get(`https://localhost:44396/api/Sweets/findByName/${event}`)
        .then((d) => {
            console.log(d.data)
            setItem(d.data)
        })
    }
    const findSupleir=(event)=>{
        axios.get(`https://localhost:44396/api/Sweets/findBySupleir/${event}`)
        .then((d) => {
            console.log(d.data)
            setItem(d.data)
        })
    }
    return (
    <div>
        <div className="nav">
            <span className="titel">ניהול פאנל</span>
        </div>
         
        {/* כפתור לעדכון מחיר */}
        <Button variant="primary" onClick={funk}> עדכון מחיר</Button><br></br>
        
        {/* חיפושים */}
        <label id="byBarcod" >חיפוש מוצר לפי ברקוד</label>
        <input id="byBarcod" className="background" onChange={event => findId(event.target.value)}></input>
        <label id="byName" >חיפוש מוצר לפי שם</label>
        <input id="byName"  className="background" onChange={event => findName(event.target.value)}></input>
        <label id="bySupleir">  חיפוש מוצר לפי ספק </label>
        <input id="bySupleir" className="background" onChange={event => findSupleir(event.target.value)}></input>
         
        {/* הצבה של הנתונים שנשלפו בטבלה בצורה דינאמית */}
        <Table striped bordered hover variant="f9720000" className="tabl">
            <thead>
                <tr>
                    <th>תמונה</th>
                    <th>ברקוד</th>
                    <th>שם מוצר</th>
                    <th>מחיר</th>
                    <th>מחיר חדש</th>
                    <th>ספק</th>
                </tr>
            </thead>
            <tbody>
                {
                 item.map((it) => (
                   <tr key={it.id}><img src={it.image} className="image"></img>
                        <td >{it.id}</td>
                        <td>{it.name}</td>
                        <td>
                            {
                            // אם לחצו על עדכן מחיר תפתח אפשרות לשינוי מחיר  
                            ok ?'':
                                <div>
                                    <input placeholder="בכמה אחוזים תרצה לשנות?" className="ev" onChange={event => change(event.target.value)} ></input>
                                    <button type="submit" onClick={() => {
                                    setAct()
                                    change2(it)
                                  
                                    }} > שמור שינויים</button>
                                    </div>
                            }
                        {
                        //אם לא לחצו על עדכון מחיר, שיציג את המחירים בשדות
                            !act? it.price :''
                        }
                        </td>
                         <td>
                            {it.newPrice}<br></br>
                            {
                                // חישוב של מספר האחוזים לשדה  במידה והשדה גדול מ0  
                                it.discount===''?' ':  <span className="discount">{it.discount}({parseInt(it.newPrice/parseFloat(it.price)*100)+"%"})</span>
                            }
                        </td>
                        <td>{it.supplier}</td>
                    </tr>
                ))

                }
            </tbody>
        </Table>



    </div>)
}
export default Items;