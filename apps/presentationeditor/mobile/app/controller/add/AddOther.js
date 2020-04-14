/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
/**
 *  AddOther.js
 *  Presentation Editor
 *
 *  Created by Julia Svinareva on 10/04/20
 *  Copyright (c) 2020 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'core',
    'presentationeditor/mobile/app/view/add/AddOther',
    'jquery',
    'underscore',
    'backbone'
], function (core, view, $, _, Backbone) {
    'use strict';

    PE.Controllers.AddOther = Backbone.Controller.extend(_.extend((function() {

        return {
            models: [],
            collections: [],
            views: [
                'AddOther'
            ],

            initialize: function () {
                Common.NotificationCenter.on('addcontainer:show', _.bind(this.initEvents, this));

                this.addListeners({
                    'AddOther': {
                        'page:show' : this.onPageShow
                    }
                });
            },

            setApi: function (api) {
                var me = this;
                me.api = api;
            },

            setMode: function (mode) {
                this.view = this.getView('AddOther');
                this.view.canViewComments = mode.canViewComments;
            },

            onLaunch: function () {
                this.createView('AddOther').render();
            },

            initEvents: function () {
                var me = this;

            },

            onPageShow: function (view, pageId) {
                var me = this;

                $('.page[data-page=addother-comment] li a').single('click',    _.buffered(me.onInsertComment, 100, me));

                if (pageId == '#addother-insert-comment') {
                    me.initInsertComment(false);
                }
            },

            // Handlers
            initInsertComment: function (documentFlag) {
                var comment = PE.getController('Common.Controllers.Collaboration').getCommentInfo();
                if (comment) {
                    this.getView('AddOther').renderComment(comment);
                    $('#done-comment').single('click', _.bind(this.onDoneComment, this, documentFlag));
                    $('.back-from-add-comment').single('click', _.bind(function () {
                        if ($('#comment-text').val().length > 0) {
                            uiApp.modal({
                                title: '',
                                text: this.textDeleteDraft,
                                buttons: [
                                    {
                                        text: this.textCancel
                                    },
                                    {
                                        text: this.textContinue,
                                        onClick: function () {
                                            PE.getController('AddContainer').rootView.router.back();
                                        }
                                    }]
                            })
                        } else {
                            PE.getController('AddContainer').rootView.router.back();
                        }
                    }, this))
                }
            },

            onDoneComment: function(documentFlag) {
                var value = $('#comment-text').val();
                if (value.length > 0) {
                    PE.getController('Common.Controllers.Collaboration').onAddNewComment(value, documentFlag);
                    PE.getController('AddContainer').hideModal();
                }
            },

            textDeleteDraft: 'Delete draft?',
            textCancel: 'Cancel',
            textContinue: 'Continue'

        }
    })(), PE.Controllers.AddOther || {}))
});