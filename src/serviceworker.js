import { manifest, version } from '@parcel/service-worker';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(
    manifest.map(urlPath => {
        let revision = null;
        if (urlPath.endsWith('.html') || urlPath.endsWith('.json')) {
            //html und json files are not versioned by parcel,
            //hence we supply an explicit revision
            revision = version;
        }
        return { url: urlPath, revision: revision };
    }),
    {
        // Ignore URL all parameters
        ignoreURLParametersMatching: [/.*/],
    }
);