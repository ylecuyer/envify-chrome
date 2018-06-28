function matchRule(str, rule) {
	return new RegExp(rule.split("*").join(".*")).test(str);
}

function getColorFromUrl(url) {
	var color = null

  console.log(url)
  console.log(env)
	env.forEach(function(env) {
		if (matchRule(url, env.match)) {
			color = env.color
		}
	})

	return color
}

function setColorInsideTab(color) {

  if (color == null)
    return

  envify_left_div = document.createElement('div')
  envify_left_div.classList.add('envify')
  envify_left_div.classList.add('left')

  envify_right_div = document.createElement('div')
  envify_right_div.classList.add('envify')
  envify_right_div.classList.add('right')

  envify_right_div.style.backgroundColor = color
  envify_left_div.style.backgroundColor = color
  document.body.classList.add('envify')
  document.body.appendChild(envify_left_div)
  document.body.appendChild(envify_right_div)
}

url = window.location.href

chrome.storage.sync.get("environments", function(results){
  console.log(results);
  env = []
  let { environments } = results;

  if (environments == undefined) {
    return
  }

  Object.keys(environments).map(function(value){
    env.push( { match: value, color: environments[value] });
  });

  env.sort(function(a, b) {
    return a.match.length - b.match.length
  })

  setColorInsideTab(getColorFromUrl(url))
})

