let listEnvironments = document.querySelector(".list-environments")
let btnAddEnv = document.getElementById("btn-add-env");
let btnSaveEnv = document.getElementById("btn-save-env");
let selectVisualStyle = document.getElementById("select-visual-style");

let addEnvironment = function(url, color){
	let environmentNode =  document.createElement("section");
	environmentNode.classList.add("environment");

	let envColor = document.createElement("input");
	envColor.type = "color";
	envColor.value = color || randomDefaultColor();
	environmentNode.appendChild(envColor);
	
	let envDomain = document.createElement("input");
	envDomain.type = "text";
	envDomain.placeholder = "*.dev.example.com";
	envDomain.value = url || "";
	environmentNode.appendChild(envDomain);

	let envRemove = document.createElement("button");
	envRemove.className = "btn-remove";
	envRemove.textContent = "Remove";
	envRemove.addEventListener("click", () => removeEnvironment(environmentNode), false);
	environmentNode.appendChild(envRemove);

	listEnvironments.appendChild(environmentNode);
}

let randomDefaultColor = function(){
	let flatColors = [ "#0a84ff", "#00feff", "#ff1ad9", "#30e60b", "#ffe900", "#ff0039", "#9400ff", "#ff9400", "#363959", "#737373"];
	return flatColors[ Math.floor(Math.random() * flatColors.length)];
}

let removeEnvironment = function(section){
	section.remove();
}

let updateEnvironments = function(){
	let environments = {};
	for (let el of listEnvironments.children){
		let url = el.querySelector("input[type=text]").value;
		if(!url){
			continue;
		}
		environments[url] = el.querySelector("input[type=color]").value;
	}
	browser.storage.sync.set({"environments": environments}).catch(function(err){
		btnAddEnv.setCustomValidity("Could not save your environments");
		btnAddEnv.reportValidity();
	});
}

let updateVisualStyle = function(){
	let visualStyle = selectVisualStyle.value;
	browser.storage.sync.set({"visualStyle": visualStyle}).catch(function(err){
		selectVisualStyle.setCustomValidity("Could not save the selected visual style");
		selectVisualStyle.reportValidity();
	});
}

btnAddEnv.addEventListener("click", addEnvironment, false)
btnSaveEnv.addEventListener("click", updateEnvironments, false)
selectVisualStyle.addEventListener("change", updateVisualStyle, false)

document.addEventListener("DOMContentLoaded", function(){
	browser.storage.sync.get(["environments", "visualStyle"]).then((results) => {
		let environments = results.environments;
		let visualStyle = results.visualStyle;

		if(environments != undefined){
			Object.keys(environments).map(function(value){
				addEnvironment(value, environments[value]);
			});
		}

		if(visualStyle === undefined){
			selectVisualStyle.value = "leftright";
		}else{
			selectVisualStyle.value = visualStyle;
		}
	})
	.catch(function(err){
		btnAddEnv.setCustomValidity("Could not load your environments");
		btnAddEnv.reportValidity();
		selectVisualStyle.setCustomValidity("Could not load your selected visual style");
		selectVisualStyle.reportValidity();
	})
}, false)
