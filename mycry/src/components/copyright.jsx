import React ,{useState,useContext} from 'react';
import ROUTES from '../router/router';
import classNames from 'classnames';
import { FormattedMessage } from "react-intl";
function copyright() {

    return (

        <div className={classNames('flex mx-auto h-[94vh] bg-[url(/icon/mycry/mycryBG.png)] bg-[length:100%_100%] bg-center bg-no-repeat justify-around')}>
          <div className='container w-[1270px]' >
            <div className={classNames('flex mx-auto w-1/2 h-[94vh] flex-col pt-20')}>
                <p className='text-[40px] font-[800]'><FormattedMessage defaultMessage="版權聲明" id="copyright.title"></FormattedMessage></p>
                <p className='font-[700]'><FormattedMessage defaultMessage="版權內文" id="copyright.body"></FormattedMessage></p>
            </div>
          </div>
        </div>
      );
}

export default copyright;
