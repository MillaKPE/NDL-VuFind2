/*global finna, VuFind */
finna.organisationInfoWidget = (function finnaOrganisationInfoWidget() {
  var holder = null;
  var service = null;
  var schedulesLoading = false;
  var organisationList = {};

  function updatePrevBtn(response) {
    var prevBtn = holder.find('.week-navi.prev-week');
    if ('openTimes' in response
      && 'currentWeek' in response.openTimes
      && response.openTimes.currentWeek
    ) {
      prevBtn.fadeTo(200, 0).addClass('disabled').attr('disabled', true);
    } else {
      prevBtn.fadeTo(200, 1).removeClass('disabled').removeAttr('disabled');
    }
  }

  function updateNextBtn(response) {
    var nextBtn = holder.find('.week-navi.next-week');
    if (response.openTimes.museum === true) {
      nextBtn.fadeTo(200, 0).addClass('disabled').attr('disabled', true);
    } else {
      nextBtn.fadeTo(200, 1).removeClass('disabled').removeAttr('disabled');
    }
  }

  function updateWeekNum(week) {
    holder.data('week-num', week);
    holder.find('.week-navi-holder .week-text .num').text(week);
  }

  function toggleSpinner(mode) {
    var spinner = holder.find('.loader');
    if (mode) {
      spinner.fadeIn();
    } else {
      spinner.hide();
    }
  }

  function schedulesLoaded(id, response) {
    schedulesLoading = false;
    $('.time-staff').empty();

    holder.find('.week-navi-holder .week-navi').each(function handleWeekNavi() {
      var classes = $(this).data('icon-classes');
      if (classes) {
        $(this).children('i').first().attr('class', classes);
      }
    });

    if ('periodStart' in response) {
      holder.data('period-start', response.periodStart);
    }

    if ('weekNum' in response) {
      var week = parseInt(response.weekNum);
      updateWeekNum(week);
    }
    updatePrevBtn(response);
    updateNextBtn(response);
    var schedulesHolder = holder.find('.schedules .opening-times-week');
    schedulesHolder.find('> div').not('.template').remove();

    var data = organisationList[id];
    var hasSchedules = 'openTimes' in response && 'schedules' in response.openTimes
      && response.openTimes.schedules.length > 0;

    if (hasSchedules) {
      var schedules = response.openTimes.schedules;

      var dayRowTpl = holder.find('.day-container.template').clone().removeClass('template hide');
      var timeRowTpl = holder.find('.time-row.template').not('.staff').clone().removeClass('template hide');

      var dayRow = dayRowTpl.clone();
      $.each(schedules, function handleSchedule(ind, obj) {
        var today = 'today' in obj;
        var dayCnt = 0;

        dayRow.toggleClass('today', today);

        if (!('closed' in obj)) {
          var currentSelfservice = null;
          var currentDate = null;

          var selfserviceAvail = false;
          var currentTimeRow = null;
          var addFullOpeningTimes = true;
          var firstElement = obj.times[0];
          var lastElement = obj.times[obj.times.length - 1];
          var info = 'info' in obj ? obj.info : null;
          $.each(obj.times, function handleOpenTimes(tind, time) {
            var selfservice = !!time.selfservice;
            selfserviceAvail = selfserviceAvail || 'selfservice' in time;

            var date = dayCnt === 0 ? obj.date : '';
            var day = dayCnt === 0 ? obj.day : '';

            if (currentDate !== obj.date) {
              dayCnt = 0;
            }

            var timeOpens = time.opens;
            var timeCloses = time.closes;
            if (!selfservice || obj.times.length === 1) {
              if (currentSelfservice === null || selfservice !== currentSelfservice) {
                var timeRow = timeRowTpl.clone();
                timeRow.find('.date').text(date);
                timeRow.find('.name').text(day);
                if (info === null) {
                  timeRow.find('.info').hide();
                } else {
                  timeRow.find('.info').text(info);
                }
                if (addFullOpeningTimes && obj.times.length > 1) {
                  timeRow.find('.opens').text(firstElement.opens);
                  timeRow.find('.closes').text(lastElement.closes);
                  dayRow.append(timeRow);
                  timeRow = timeRowTpl.clone();
                  addFullOpeningTimes = false;
                }
                timeRow.find('.opens').text(timeOpens);
                timeRow.find('.closes').text(timeCloses);

                if (selfserviceAvail && selfservice !== currentSelfservice) {
                  timeRow.toggleClass('staff', !selfservice);
                }
                if (time.selfservice === true) {
                  timeRow.find('.name-staff').hide();
                  timeRow.find('.selfservice-only').removeClass('hide');
                }
                dayRow.append(timeRow);
                currentTimeRow = timeRow;
              } else {
                var timePeriod = currentTimeRow.find('.time-template').eq(0).clone();
                timePeriod.find('.opens').text(timeOpens);
                timePeriod.find('.closes').text(timeCloses);
                currentTimeRow.find('.time-container').append(timePeriod);
              }

              currentSelfservice = selfservice;
              currentDate = obj.date;

              dayCnt++;
            }
          });
        } else {
          var timeRow = timeRowTpl.clone();
          timeRow.find('.date').text(obj.date);
          timeRow.find('.name').text(obj.day);
          timeRow.find('.info').text(obj.info);
          timeRow.find('.period, .name-staff').hide();
          timeRow.find('.closed-today').removeClass('hide');
          dayRow.append(timeRow);

          dayRow.toggleClass('is-closed', true);
        }

        dayCnt = 0;
        schedulesHolder.append(dayRow);
        dayRow = dayRowTpl.clone();
      });
    } else {
      var links = null;
      var linkHolder = holder.find('.mobile-schedules');
      linkHolder.empty();

      if (data.mobile) {
        linkHolder.show();
        if ('links' in data.details) {
          $.each(data.details.links, function handleLink(ind, obj) {
            var link = holder.find('.mobile-schedule-link-template').eq(0).clone();
            link.removeClass('hide mobile-schedule-link-template');
            link.find('a').attr('href', obj.url).text(obj.name);
            link.appendTo(linkHolder);
          });
          links = true;
        }
      }
      if (!links) {
        holder.find('.no-schedules').show();
      }
    }

    // References
    var infoHolder = holder.find('.schedules-info');
    infoHolder.empty();

    if ('scheduleDescriptions' in data.details) {
      $.each(data.details.scheduleDescriptions, function handleScheduleDescriptions(ind, _obj) {
        var obj = _obj.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $('<p/>').html(obj).appendTo(infoHolder);
      });
      infoHolder.show();
    }

    holder.find('.week-navi-holder').toggle(hasSchedules);
    schedulesHolder.stop(true, false).fadeTo(200, 1);
  }

  function keyHandler(e, element) {
    if (e.key === 'Enter') {
      element.click();
    }
  }

  function attachWeekNaviListener() {
    holder.find('.week-navi').off('click').on('click', function onClickWeekNavi() {
      if ($(this).hasClass('disabled')) {
        return;
      }
      if (schedulesLoading) {
        return;
      }
      schedulesLoading = true;

      var parent = holder.data('parent');
      var id = holder.data('id');
      var dir = parseInt($(this).data('dir'));

      holder.find('.week-text .num').text(holder.data('week-num') + dir);

      var icon = $(this).children('i').first();
      $(this).data('icon-classes', icon.attr('class'));
      icon.removeClass('fa-arrow-right fa-arrow-left');
      icon.addClass('fa-spinner fa-spin');
      const queryParams = {
        action: 'details',
        target: holder.data('target'),
        parent: parent,
        id: id,
        periodStart: holder.data('period-start'),
        dir: dir,
        fullDetails: 0,
        allServices: 0
      };
      service.getSchedules(
        queryParams,
        function onGetSchedules(response) {
          schedulesLoaded(id, response);
        }
      );
    }).on('keydown', function onWeekNaviKeydown(e) {
      keyHandler(e, $(this));
    });
  }

  function detailsLoaded(id, response) {
    toggleSpinner(false);
    if (null === response) {
      return;
    }

    if ('periodStart' in response) {
      holder.data('period-start', response.periodStart);
    }

    updatePrevBtn(response);
    updateNextBtn(response);
    if ('phone' in response) {
      holder.find('.phone')
        .attr('data-original-title', response.phone)
        .on('keydown', function onPhoneKeydown(e) {
          keyHandler(e, $(this));
        }).show();
    }
    if ('emails' in response) {
      holder.find('.emails')
        .attr('data-original-title', response.emails)
        .attr('data-toggle', 'tooltip')
        .on('keydown', function onEmailsKeydown(e) {
          keyHandler(e, $(this));
        }).show();
      finna.layout.initToolTips(holder);
    }

    if ('links' in response) {
      var links = response.links;
      if (links.length) {
        $.each(links, function handleLink(ind, obj) {
          if (obj.name.includes('Facebook')) {
            holder.find('.facebook')
              .attr('href', obj.url)
              .attr('aria-label', VuFind.translate('organisation_info_facebook') + ' (' + VuFind.translate('external_link') + ')')
              .show();
          }
        });
      }
    }

    var img = holder.find('.facility-image');
    if ('pictures' in response) {
      var imgLink = img.parent('a');
      imgLink.attr('href', (imgLink.data('href') + '#' + id));
      var src = response.pictures[0].url;
      img.show();
      if (img.attr('src') !== src) {
        img.fadeTo(0, 0);
        img.on('load', function onLoadImage() {
          $(this).stop(true, true).fadeTo(300, 1);
        });
        img.attr('src', src).attr('alt', name);
        img.closest('.info-element').show();
      } else {
        img.fadeTo(300, 1);
      }
    } else {
      img.hide();
    }

    if ('services' in response) {
      $.each(response.services, function handleService(ind, obj) {
        holder.find('.services .service-' + obj).show();
      });
    }
  }

  function showDetails(id, name, allServices) {
    holder.find('.error,.info-element').hide();
    holder.find('.is-open').hide();

    var parent = holder.data('parent');
    var sector = holder.data('sector');
    var data = service.getDetails(id);
    if (!data) {
      detailsLoaded(id, null);
      return;
    }

    holder.data('id', id);

    if ('openTimes' in data && 'openNow' in data
      && 'schedules' in data.openTimes && data.openTimes.schedules.length
    ) {
      holder.find('.is-open' + (data.openNow ? '.open' : '.closed')).show();
    }

    if ('email' in data) {
      holder.find('.email.info-element').show();
    }

    var detailsLinkHolder = holder.find('.details-link').show();
    var detailsLink = detailsLinkHolder.find('a');
    detailsLink.attr('href', detailsLink.data('href') + ('#' + id));

    if ('routeUrl' in data) {
      holder.find('.route').attr('href', data.routeUrl).show();
    }

    if ('mapUrl' in data && 'address' in data) {
      var map = holder.find('.map');
      map.find('> a').attr('href', data.mapUrl);
      map.find('.map-address')
        .text(data.address)
        .attr('aria-label', VuFind.translate('Location') + ': ' + data.address + ' (' + VuFind.translate('external_link') + ', ' + VuFind.translate('Open in a new window') + ')');
      map.show();
    }

    const queryParams = {
      action: 'details',
      target: holder.data('target'),
      parent: parent,
      sector: sector,
      id: id,
      periodStart: holder.data('period-start'),
      dir: null,
      fullDetails: 1,
      allServices: allServices ? 1 : 0
    };
    service.getSchedules(
      queryParams,
      function handleSchedule(response) {
        if (response) {
          schedulesLoaded(id, response);
          detailsLoaded(id, response);
          holder.trigger('detailsLoaded', id);
        }
      }
    );
  }

  function menuClicked(disable) {
    var toggle = holder.find('.organisation .dropdown-toggle');
    var id = toggle.data('id');
    var name = holder.find('.organisation ul.dropdown-menu li[data-id="' + id + '"]').text();

    toggle.find('span:not(.sr-only)').text(name);
    showDetails(id, name, false);

    if (disable) {
      var menu = holder.find('.organisation.dropdown');
      menu.replaceWith(menu.find('.dropdown-toggle span'));
    }
  }

  function organisationListLoaded(data) {
    var list = data.list;
    var id = data.id;
    var found = false;
    var menu = holder.find('.organisation ul.dropdown-menu');
    var menuToggle = holder.find('.organisation .dropdown-toggle');

    $.each(list, function handleOrganisationList(ind, obj) {
      if (String(id) === String(obj.id)) {
        found = true;
      }
      $('<li role="menuitem" tabindex="0" data-id="' + obj.id + '">' + obj.name + '</li>')
        .on('keydown', function onOrganisationKeydown(e) {
          keyHandler(e, $(this));
        }).appendTo(menu);
      organisationList[obj.id] = obj;
    });

    if (!found) {
      id = finna.common.getField(data.consortium.finna, 'service_point');
      if (!id) {
        id = menu.find('li').eq(0).data('id');
      }
    }
    menuToggle.data('id', id);
    var menuItem = holder.find('.organisation ul.dropdown-menu li');
    menuItem.on('click', function onClickMenuItem() {
      menuToggle.data('id', $(this).data('id'));
      menuClicked(false);
    });

    menuClicked(list.length === 1);
    toggleSpinner(false);
    holder.find('.content').removeClass('hide');
    var week = parseInt(data.weekNum);
    updateWeekNum(week);
    attachWeekNaviListener();
  }

  /**
   * Loads organisation list.
   *
   * @returns void
   */
  function loadOrganisationList() {
    holder.find('.week-navi.prev-week').fadeTo(0, 0);

    var parent = holder.data('parent');
    if (typeof parent == 'undefined') {
      return;
    }
    var buildings = holder.data('buildings');
    var sector = holder.data('sector');

    toggleSpinner(true);
    holder.find('.error,.info-element').hide();
    const searchParams = {
      target: holder.data('target'),
      parent: parent,
      buildings: buildings,
      sector: sector
    };
    service.getOrganisations(searchParams, function onGetOrganisations(response) {
      if (response === false) {
        holder.html('<!-- Organisation info could not be loaded');
      } else {
        organisationListLoaded(response);
      }
    });
  }

  var my = {
    loadOrganisationList: loadOrganisationList,
    organisationListLoaded: organisationListLoaded,
    showDetails: showDetails,
    init: function init(_holder, _service) {
      holder = _holder;
      service = _service;
    }
  };

  return my;
})();
