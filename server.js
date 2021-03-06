//create an instance of express and Sequelize
const express= require('express');
const Sequelize=require('sequelize');
const Op = Sequelize.Op;
const _USERS =require('./users.json');


const app = express();
const port=8001;

//creating a connection with sequelize
const connection = new Sequelize('db','user','pass',{
host:'localhost',
dialect:'sqlite',
storage:'db.sqlite',
operatorsAliases:false
});

//creating the user model
const User = connection.define('User',{
name:Sequelize.STRING,
email:{
    type:Sequelize.STRING,
    validate:{
        isEmail:true
    }
},
password: {
    type:Sequelize.STRING,
    validate:{
        isAlphanumeric:true
    }
}
})

//creating the Post model

const Post = connection.define('Post',{
    title:Sequelize.STRING,
    content:Sequelize.TEXT
})

//creating the Comment model
const Comment = connection.define('Comment',{
    the_comment:Sequelize.STRING    
})


const Project = connection.define('Project',{
    title:Sequelize.STRING    
})

app.get('/allposts',(req,res)=>{
   
   Post.findAll({
       include:[{       
       model:User , as:'UserRef'
    }]
   })
   .then(posts =>{
    res.json(posts);
   })
 .catch(error =>{
    console.log(error);
    res.status(404).send(error);
  })

})

app.get('/singlepost',(req,res)=>{
   
    Post.findById('1',{
        include:[{       
        model:Comment , as:'All_Comments',
        attributes:['the_comment']
     },{
      model:User , as: 'UserRef'   
     }]
    })
    .then(posts =>{
     res.json(posts);
    })
  .catch(error =>{
     console.log(error);
     res.status(404).send(error);
   })
 
 
 })




 app.put('/addWorker',(req,res)=>{
   
    Project.findById(2).then((project)=>{
        project.addWorkers(5);
    })
    .then( () =>{
     res.send('User Added');
    })
  .catch(error =>{
     console.log(error);
     res.status(404).send(error);
   })
 
 })



 app.get('/getUserProjects',(req,res)=>{
   
    User.findAll({
        attributes:['name'],
        include:[{
           model:Project, as:'Tasks',
           attributes:['title']
        }]
    })
    .then( output =>{
     res.json(output);
    })
  .catch(error =>{
     console.log(error);
     res.status(404).send(error);
   })
 
 })



Post.belongsTo(User, {as:'UserRef', foreignKey: 'userId' }); //puts foreignKey UserId in Post table

Post.hasMany(Comment,{as:'All_Comments' }); //foreignKey =PostId in comment table



//Creates a UserProjects table with IDs for ProjectId and UserId
User.belongsToMany(Project, {as:'Tasks', through:'UserProjects' });
Project.belongsToMany(User, {as:'Workers',through:'UserProjects'});




//syncing and authenticate sequel
connection
.sync({
    //force will drop a user table then recreate it
    //force:true
})
// .then(()=>{
//     Project.create({
//        title:'project 1'
//     }).then((project)=>{
//         project.setWorkers([4,5]);
//     })
// })
// .then(()=>{
//     Project.create({
//        title:'project 2'
//     })
// })



/**.then(()=>{
    User.bulkCreate(_USERS)
    .then(users => {
       console.log("Success adding users");
    })
    .catch(error => {
        console.log(error);
    })
}) 
.then(()=>{
  Post.create({
   userId:1,
   title:'First Post',
   content:'post content 1'
  })
})  **/

 
.then(()=>{
    Post.create({
     userId:1,
     title:'Second Post',
     content:'post content 2'
    })
  })

   
.then(()=>{
    Post.create({
     userId:2,
     title:'Third Post',
     content:'post content 3'
    })
  })

  .then(()=>{
    Comment.create({
     PostId:1,
     the_comment:'First comment'
    })
  })

   
.then(()=>{
    Comment.create({
     PostId:1,
     the_comment:'second comment here'
    })
  })
//enter data into database using create method

.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.error('Unable to connect to the database:',err);
});

app.listen(port,()=>{
console.log('Running server on port ' + port);
});

