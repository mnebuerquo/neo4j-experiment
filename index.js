var name = require('sillyname')
var async = require('async')
var User = require('./user');

function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}

function phone(area, rndval){
	return "" + area + pad(Math.round(rndval*10000000),7)
}

function createUsers(n){
	let users = []
	for (let i=0; i<n; i++){
		let user = {}
		const n = name()
		user.fullname = n
		user.username = n.replace(/\s+/,'_').toLowerCase()
		user.phone = phone('513',Math.random())
		users.push(user)
	}
	return users
}

const users = createUsers(5)
console.log(users)

async.map(users, User.create, (err, saved) => {
	if(err){
		console.log(err)
		return
	}
	// done saving users
	console.log('done saving users')

	// now start doing relationships
	async.each(saved, (u, cb) => {
		//find all users with same phone
		console.log(u.username, ' looking for followers')
		let phonies = User.find({phone: u.phone},(err,results) =>{
			async.each(results, (f, cb) => {
				f.follow(u, cb)
				console.log(f.username, ' is following ', u.username, ' by phone')
			}, cb)
		})
	}, (err) => {
		if(err){
			console.log(err)
		}
		console.log('done adding phone followers')
	})

	async.each(saved, (u, cb) => {
		//pick random user from coll
		let x = Math.round(Math.random()*saved.length)
		let f = saved[x]
		if(f){
			f.follow(u, cb)
			console.log(f.username, ' is following ', u.username)
		} else {
			console.log(u.username, ' has no new followers at this time.')
			return cb(null)
		}
	}, (err) => {
		if(err){
			console.log(err)
		}
		console.log('done adding extra followers')
	})
}) 
