// exports modules
'use strict';
import withResponsiveStyle, {mergeStyles} from 'apps/utils_style/hoc';




/*
* Fix blurring glitch on webkit browsers when using CSS3 'transform' properties.
* WARNING: We are avoiding use of transforms at the moment. 
*		   Relative positonning is rather the way to go.
*/
function fixWebkitBrowser(styleObj) {
    for(let key in styleObj) {
        if(styleObj[key].hasOwnProperty('transform')) {
            styleObj[key]['WebkitTransform'] = styleObj[key]['transform'];
            styleObj[key]['WebkitFilter'] = 'blur(0)';
        }
    }
    return styleObj;
}



module.exports = {
	fixWebkitBrowser: fixWebkitBrowser,
	pureMergeStyles: mergeStyles,
	withResponsiveStyle: withResponsiveStyle,
}