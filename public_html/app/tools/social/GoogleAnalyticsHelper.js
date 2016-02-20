/**
 * @class GoogleAnalyticsHelper
 *
 * @see {@link https://developers.google.com/web/updates/2015/08/using-requestidlecallback}
 *
 * @author Mauro Trevisan
 */
var GoogleAnalyticsHelper = (function(){

	var eventsToSend = [],
		isRequestIdleCallbackScheduled;

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-46256840-1', 'orgfree.com');
	ga(function(tracker){
		tracker.send('pageview');
	});


	var trackPageView = function(page, title){
		eventsToSend.push({
			hitType: 'pageview',
			page: page,
			title: title
		});

		schedulePendingEvents();
	};

	var trackEvent = function(category, action, label){
		eventsToSend.push({
			hitType: 'event',
			eventCategory: category,
			eventAction: action,
			eventLabel: label
		});

		schedulePendingEvents();
	};

	/** @private */
	var schedulePendingEvents = function(){
		//only schedule the callback if one has not already been set
		if(isRequestIdleCallbackScheduled)
			return;

		isRequestIdleCallbackScheduled = true;


		if('requestIdleCallback' in window)
			//wait at most two seconds before processing events
			requestIdleCallback(processPendingAnalyticsEvents, {timeout: 2000});
		else
			processPendingAnalyticsEvents();
	};


	/** @private */
	var processPendingAnalyticsEvents = function(deadline){
		//reset the boolean so future callbacks can be set
		isRequestIdleCallbackScheduled = false;

		//if there is no deadline, just run as long as necessary (this will be the case if requestIdleCallback doesn’t exist)
		if(typeof deadline === 'undefined')
			deadline = {timeRemaining: Number.MAX_VALUE};

		//go for as long as there is time remaining and work to do
		while((deadline.timeRemaining || deadline.didTimeout) && eventsToSend.length)
			ga('send', eventsToSend.pop());

		//check if there are more events still to send
		if(eventsToSend.length)
			schedulePendingEvents();
	};


	return {
		trackPageView: trackPageView,
		trackEvent: trackEvent
	};
})();
