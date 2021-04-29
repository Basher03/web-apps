import React, { Component } from 'react';
import { Page, View, Navbar, Subnavbar, Icon } from 'framework7-react';
import { observer, inject } from "mobx-react";

import Settings from '../view/settings/Settings';
import CollaborationView from '../../../../common/mobile/lib/view/collaboration/Collaboration.jsx'
import CellEditor from '../controller/CellEditor';
import Statusbar from '../controller/StatusBar'
import AddOptions from "../view/add/Add";
import EditOptions from "../view/edit/Edit";
import { Search, SearchSettings } from '../controller/Search';
import { f7 } from 'framework7-react';
import FilterOptionsController from '../controller/FilterOptions'
import {FunctionGroups} from "../controller/add/AddFunction";
import ContextMenu from '../controller/ContextMenu';
import { Toolbar } from "../controller/Toolbar";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editOptionsVisible: false,
            addOptionsVisible: false,
            addShowOptions: null,
            settingsVisible: false,
            collaborationVisible: false,
        };
    }

    handleClickToOpenOptions = (opts, showOpts) => {
        f7.popover.close('.document-menu.modal-in', false);
        this.setState(state => {
            if ( opts == 'edit' )
                return {editOptionsVisible: true};
            else if ( opts == 'add' )
                return {
                    addOptionsVisible: true,
                    addShowOptions: showOpts
                };
            else if ( opts == 'settings' )
                return {settingsVisible: true};
            else if ( opts == 'coauth' )
                return {collaborationVisible: true};
        });
    };

    handleOptionsViewClosed = opts => {
        (async () => {
            await 1 && this.setState(state => {
                if ( opts == 'edit' )
                    return {editOptionsVisible: false};
                else if ( opts == 'add' )
                    return {addOptionsVisible: false};
                else if ( opts == 'settings' )
                    return {settingsVisible: false};
                else if ( opts == 'coauth' )
                    return {collaborationVisible: false};
            })
        })();
    };

    // onClickToCloseFilter = () => {
    //     f7.popover.open('#picker-popover')
    //     console.log('Close!')
    // }

  render() {
      const appOptions = this.props.storeAppOptions;
      const config = appOptions.config;
      const showLogo = !(appOptions.canBrandingExt && (config.customization && (config.customization.loaderName || config.customization.loaderLogo)));
      return (
            <Page name="home" className={showLogo && 'page-with-logo'}>
              {/* Top Navbar */}
                <Navbar id='editor-navbar' className={`main-navbar${showLogo ? ' navbar-with-logo' : ''}`}>
                    {showLogo && <div className="main-logo"><Icon icon="icon-logo"></Icon></div>}
                    <Subnavbar>
                        <Toolbar openOptions={this.handleClickToOpenOptions} closeOptions={this.handleOptionsViewClosed}/>
                        <Search useSuspense={false}/>
                    </Subnavbar>
                </Navbar>
                <CellEditor onClickToOpenAddOptions={(panels, button) => this.handleClickToOpenOptions('add', {panels: panels, button: button})}/>
                {/* Page content */}
                <View id="editor_sdk" />
                <SearchSettings useSuspense={false} />
                {
                    !this.state.editOptionsVisible ? null :
                        <EditOptions onclosed={this.handleOptionsViewClosed.bind(this, 'edit')} />
                }
                {
                    !this.state.addOptionsVisible ? null :
                        <AddOptions onclosed={this.handleOptionsViewClosed.bind(this, 'add')} showOptions={this.state.addShowOptions} />
                }
                {
                    !this.state.settingsVisible ? null :
                        <Settings onclosed={this.handleOptionsViewClosed.bind(this, 'settings')} />
                }
                {
                    !this.state.collaborationVisible ? null :
                        <CollaborationView onclosed={this.handleOptionsViewClosed.bind(this, 'coauth')} />
                }
                {
                    <FilterOptionsController />
                }
                <Statusbar />

                <FunctionGroups /> {/* hidden component*/}
                <ContextMenu openOptions={this.handleClickToOpenOptions.bind(this)} />
            </Page>
      )
  }
}

export default inject("storeAppOptions")(observer(MainPage));