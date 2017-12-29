var async = require('async')
var User = require('./user');

function connectRest(){
	console.log('looking for unconnected users')
	const unconnected = User.findUnconnected({}, (err,results)=>{
		if(err){
			console.log(err)
			return
		}
		console.log('found unconnected users')
		console.log(results)
		console.log('doing each now =====================>')
		const byname = {}
		async.each(results, (user, next)=>{
			console.log('found:',user)

			const fullname = user._node.properties.fullname
			const username = user._node.properties.username
			if (! fullname) {
				console.log('no fullname, skipping')
				return next()
			}
			
			const n = fullname.split(/\s+/).pop()
			if(!byname[n]){
				console.log('first of ',n)
				byname[n] = [user]
				next()
			} else {
				target = byname[n].slice(-1)[0]
				console.log('joining ', target._node.properties.fullname)
				user.follow(target,(err)=>{
					console.log(username, ' is following ', target._node.properties.username)
					byname[n].push(user)
					next()
				})
			}
		})
	})
} 

connectRest()
