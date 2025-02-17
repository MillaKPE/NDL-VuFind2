<?php

/**
 * Error Controller
 *
 * PHP version 7
 *
 * Copyright (C) The National Library of Finland 2016.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category VuFind
 * @package  Controller
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     https://vufind.org Main Site
 */

namespace Finna\Controller;

/**
 * Error Controller
 *
 * @category VuFind
 * @package  Controller
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     https://vufind.org Main Site
 */
class ErrorController extends \VuFind\Controller\ErrorController
{
    /**
     * Display unavailable message.
     *
     * @return mixed
     */
    public function unavailableAction()
    {
        // Handle AdminApi requests even if the site is unavailable
        $event = $this->getEvent();
        if ($event) {
            $router = $event->getRouter();
            if ($router) {
                $routeMatch = $router->match($this->getRequest());
                if (
                    strcasecmp($routeMatch->getParam('controller'), 'adminapi') == 0
                ) {
                    return $this->forward()->dispatch(
                        $routeMatch->getParam('controller'),
                        $routeMatch->getParams()
                    );
                }
            }
        }
    }
}
