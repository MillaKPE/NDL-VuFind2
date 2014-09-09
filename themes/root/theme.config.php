<?php
return array(
    'extends' => false,
    'helpers' => array(
        'factories' => array(
            'addthis' => 'VuFind\View\Helper\Root\Factory::getAddThis',
            'auth' => 'VuFind\View\Helper\Root\Factory::getAuth',
            'authornotes' => 'VuFind\View\Helper\Root\Factory::getAuthorNotes',
            'cart' => 'VuFind\View\Helper\Root\Factory::getCart',
            'citation' => 'VuFind\View\Helper\Root\Factory::getCitation',
            'datetime' => 'VuFind\View\Helper\Root\Factory::getDateTime',
            'displaylanguageoption' => 'VuFind\View\Helper\Root\Factory::getDisplayLanguageOption',
            'export' => 'VuFind\View\Helper\Root\Factory::getExport',
            'feedback' => 'VuFind\View\Helper\Root\Factory::getFeedback',
            'flashmessages' => 'VuFind\View\Helper\Root\Factory::getFlashmessages',
            'googleanalytics' => 'VuFind\View\Helper\Root\Factory::getGoogleAnalytics',
            'getlastsearchlink' => 'VuFind\View\Helper\Root\Factory::getGetLastSearchLink',
            'helptext' => 'VuFind\View\Helper\Root\Factory::getHelpText',
            'historylabel' => 'VuFind\View\Helper\Root\Factory::getHistoryLabel',
            'ils' => 'VuFind\View\Helper\Root\Factory::getIls',
            'jstranslations' => 'VuFind\View\Helper\Root\Factory::getJsTranslations',
            'keepalive' => 'VuFind\View\Helper\Root\Factory::getKeepAlive',
            'proxyurl' => 'VuFind\View\Helper\Root\Factory::getProxyUrl',
            'openurl' => 'VuFind\View\Helper\Root\Factory::getOpenUrl',
            'recaptcha' => 'VuFind\View\Helper\Root\Factory::getRecaptcha',
            'record' => 'VuFind\View\Helper\Root\Factory::getRecord',
            'recordlink' => 'VuFind\View\Helper\Root\Factory::getRecordLink',
            'related' => 'VuFind\View\Helper\Root\Factory::getRelated',
            'searchbox' => 'VuFind\View\Helper\Root\Factory::getSearchBox',
            'searchoptions' => 'VuFind\View\Helper\Root\Factory::getSearchOptions',
            'searchparams' => 'VuFind\View\Helper\Root\Factory::getSearchParams',
            'searchtabs' => 'VuFind\View\Helper\Root\Factory::getSearchTabs',
            'syndeticsplus' => 'VuFind\View\Helper\Root\Factory::getSyndeticsPlus',
            'systememail' => 'VuFind\View\Helper\Root\Factory::getSystemEmail',
            'userlist' => 'VuFind\View\Helper\Root\Factory::getUserList',
            'usertags' => 'VuFind\View\Helper\Root\Factory::getUserTags',
            'worldcat' => 'VuFind\View\Helper\Root\Factory::getWorldCat',
        ),
        'invokables' => array(
            'addellipsis' => 'VuFind\View\Helper\Root\AddEllipsis',
            'browse' => 'VuFind\View\Helper\Root\Browse',
            'context' => 'VuFind\View\Helper\Root\Context',
            'currentpath' => 'VuFind\View\Helper\Root\CurrentPath',
            'highlight' => 'VuFind\View\Helper\Root\Highlight',
            'jqueryvalidation' => 'VuFind\View\Helper\Root\JqueryValidation',
            'localizedNumber' => 'VuFind\View\Helper\Root\LocalizedNumber',
            'printms' => 'VuFind\View\Helper\Root\Printms',
            'recommend' => 'VuFind\View\Helper\Root\Recommend',
            'renderarray' => 'VuFind\View\Helper\Root\RenderArray',
            'resultfeed' => 'VuFind\View\Helper\Root\ResultFeed',
            'safemoneyformat' => 'VuFind\View\Helper\Root\SafeMoneyFormat',
            'sortfacetlist' => 'VuFind\View\Helper\Root\SortFacetList',
            'summon' => 'VuFind\View\Helper\Root\Summon',
            'transesc' => 'VuFind\View\Helper\Root\TransEsc',
            'translate' => 'VuFind\View\Helper\Root\Translate',
            'truncate' => 'VuFind\View\Helper\Root\Truncate',
        )
    ),
);
