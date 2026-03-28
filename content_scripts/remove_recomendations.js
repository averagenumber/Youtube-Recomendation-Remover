async function redirect(){
	if(location.pathname == '/')
		{
			window.location.href = '/feed/subscriptions';
		}
}
async function redirectFromRoot() {
	redirect();
	
	window.addEventListener("yt-navigate-finish", redirect);
	window.addEventListener("popstate", redirect);
}	

function waitForElement(selector){
	return new Promise ((resolve) => {
		const findElement = () => document.querySelector(selector);
		const existingElement = findElement();

		if(existingElement){
			resolve(existingElement);
			return;
		}

		const startObserving = () =>{
			const root = document.body || document.documentElementl;

			if (!root){
				requestAnimationFrame(startObserving);
				return;
			}

			const observer = new MutationObserver((mutation, observer) => {
				const element = findElement();
				if(element) {
					observer.disconnect();
					resolve(element);
				}
			});

			observer.observe(root, {
				childList: true,
				subtree: true
			});
		};

		startObserving();
	});
}

function removeRecomendedVideos(){
	document.querySelectorAll('div#secondary').forEach((videos) => {
	if (videos.dataset.lowcortisolvideosEnabled === "true"){
			return;
	}
	videos.remove();
	videos.dataset.lowcortisolvideosEnabled === "true";
	});
}

function removeGuideEntries(){
	const selector = [
		'a[href="/"]',
		'a[href="/shorts/"]',
		'a[href="/shorts"]'
	];

	selector.forEach((selector) => {
		document.querySelectorAll(selector).forEach((link) => {
			link.closest("ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer")?.remove();
		})
	});
}

function disableHomeLogo(){
	document.querySelectorAll('a#logo[href="/"]').forEach((logoLink) => {
		if(logoLink.dataset.lowcortisolEnabled === "true"){
			return;
		}

		logoLink.dataset.lowcortisolEnabled = "true";
		logoLink.removeAttribute("href");
		logoLink.style.cursor = "not-allowed";
		logoLink.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
		}, true);
	});
}

function eatMainPageRedirects(){
	const root = document.body || document.documentElement;

	if(!root){
		requestAnimationFrame(eatMainPageRedirects);
		return;
	}

	removeGuideEntries();
	disableHomeLogo();

	const observer = new MutationObserver(() => {
		removeGuideEntries();
		disableHomeLogo();
	});

	observer.observe(root, {
		childList: true,
		subtree: true
	});
}

function eatRecomendedVideos(){
	const root = document.body || document.documentElement;

	if(!root){
		requestAnimationFrame(eatRecomendedVideos);
		return;
	}

	removeRecomendedVideos();

	const observer = new MutationObserver(() => {
		removeRecomendedVideos();
	});

	observer.observe(root, {
		childList: true,
		subtree: true
	});
}

browser.storage.sync.get(['redirect', 'recommendations']).then((settings) => {
  const removeMainPage = settings.redirect ?? false;
  const removeRecomendation = settings.recommendations ?? false;

  console.log("asa"+removeMainPage);
  if (removeMainPage==true) {
    console.log("Removing main page elements");
    redirectFromRoot();
    eatMainPageRedirects();
  }
  if (removeRecomendation==true) {
    console.log("Removing recommendations");
    eatRecomendedVideos();
  }
}).catch((err) => console.error("Storage error:", err));;
console.log("wowzie");