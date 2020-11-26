const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express();


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


app
.use(bodyParser.json())
.use((req,res,next)=>{res.header("Access-Control-Allow-Origin","*");res.header("Access-Control-Allow-Headers","*");next()})
.get('/students',(req,res)=>
{

    fs.readFile("students.json",(err,data)=>{

        if(err){res.status(400).json({status:"fail"});throw err;}
        else{res.json(JSON.parse(data))}

    })
})


.get('/students/:studentName',(req,res)=>
{

    fs.readFile("students.json",(err,data)=>{

        if(err){res.status(400).json({status:"fail"});throw err;}
        
        else{
            data=JSON.parse(data).filter((e)=>e.name==req.params.studentName)
            if(data.length==0){res.status(404).json({"status":"failed","reason":"No student found with given name"})}
            else{
            res.json(data[0])
            }
        }

    })
})


.get('/mentors',(req,res)=>
{

    fs.readFile("mentors.json",(err,data)=>{

        if(err){res.status(400).json({status:"fail"});throw err;}
        else{res.json(JSON.parse(data))}

    })
})

.post("/students",(req,res)=>{
    console.log(typeof req.body.name !="string"||typeof req.body.age !="number"||typeof req.body.batch !="number"||typeof req.body.contact !="number"||typeof req.body.email !="string")
    if(typeof req.body.name !="string"||typeof req.body.age !="number"||typeof req.body.batch !="number"||typeof req.body.contact !="number"||typeof req.body.email !="string")
    {res.status(400).json({status:"fail",reason:"request body invalid"});return;}

    
    else{
        fs.readFile("students.json",(err,data)=>{
            
            if(err){res.status(400).json({status:"fail"});throw err;}
            else{
                data=JSON.parse(data);

                if(data.some((e)=>e.name==req.body.name)){res.status(400).json({status:"fail",reason:"user already exists"});return;}

                data.push({name:req.body.name,age:req.body.age,batch:req.body.batch,contact:req.body.contact,email:req.body.email,mentor_name:""})

                
                fs.writeFile("students.json",JSON.stringify(data),(err)=>{res.json(data)})
            }
    
        })
    }
})


.post("/mentors",(req,res)=>{
    if(typeof req.body.name !="string"||typeof req.body.age !="number"||typeof req.body.contact !="number"||typeof req.body.email !="string")
    {res.status(400).json({status:"fail",reason:"request body invalid"});return;}

    

        fs.readFile("mentors.json",(err,data)=>{
    
            if(err){res.json({status:"fail"});throw err;}
            else{
                data=JSON.parse(data);
                
                if(data.some((e)=>e.name==req.body.name)){res.status(400).json({status:"fail",reason:"mentor already exists"});return;}
                
                data.push({name:req.body.name,age:req.body.age,contact:req.body.contact,email:req.body.email,students:[]})

                
                fs.writeFile("mentors.json",JSON.stringify(data),(err)=>{res.json(data)})
            }
    
        })

})



.post("/assignMentor",(req,res)=>{
    if(typeof req.body.student_name !="string"||typeof req.body.mentor_name !="string")
    {res.json({status:"fail",reason:"request body invalid"});return;}

    

        fs.readFile("students.json",(err,data)=>{
    
            if(err){res.json({status:"fail"});throw err;}
            else{
                data=JSON.parse(data);

                if(!data.some((e)=>e.name==req.body.student_name)){res.status(400).json({status:"fail",reason:"user does not exist"});return;}

                fs.readFile("mentors.json",(err,data2)=>{if(err){res.status(400).json({status:"fail",reason:"unable to read mentors file"})}else{
                    
                    mentorData=JSON.parse(data2);
                    if(mentorData.some((e)=>e.name==req.body.mentor_name)){

                        if(mentorData.some((e)=>e.students.includes(req.body.student_name))){mentorData.find((e)=>e.students.includes(req.body.student_name)).students.remove(req.body.student_name)}

                        console.log(mentorData.find((e)=>e.name==req.body.mentor_name).students)
                        mentorData.find((e)=>e.name==req.body.mentor_name).students.push(req.body.student_name)
                        fs.writeFile("mentors.json",JSON.stringify(mentorData),(err)=>{
                            
                            if(err){res.status(400).json({status:"fail",reason:"unable to write mentors file"});return}
                            data.find((e)=>e.name==req.body.student_name).mentor_name=req.body.mentor_name;

                
                            fs.writeFile("students.json",JSON.stringify(data),(err)=>{res.json(data)})
                            })


                }else{res.json({status:"fail",reason:"mentor does not exist"});return;}}})


            
            }
    
        })

})

.post("/removeMentor",(req,res)=>{
    if(typeof req.body.student_name !="string")
    {res.json({status:"fail",reason:"request body invalid"});return;}

    

        fs.readFile("students.json",(err,data)=>{
    
            if(err){res.json({status:"fail"});throw err;}
            else{
                data=JSON.parse(data);

                if(!data.some((e)=>e.name==req.body.student_name)){res.status(400).json({status:"fail",reason:"user does not exist"});return;}

                fs.readFile("mentors.json",(err,data2)=>{if(err){res.status(400).json({status:"fail",reason:"unable to read mentors file"})}else{
                    
                    mentorData=JSON.parse(data2);
                    if(true){

                        if(mentorData.some((e)=>e.students.includes(req.body.student_name))){mentorData.find((e)=>e.students.includes(req.body.student_name)).students.remove(req.body.student_name)}

                        
                       
                        fs.writeFile("mentors.json",JSON.stringify(mentorData),(err)=>{
                            
                            if(err){res.status(400).json({status:"fail",reason:"unable to write mentors file"});return}
                            data.find((e)=>e.name==req.body.student_name).mentor_name="";

                
                            fs.writeFile("students.json",JSON.stringify(data),(err)=>{res.json(data)})
                            })


                }}})


            
            }
    
        })

})



app.listen(process.env.PORT || 5000)