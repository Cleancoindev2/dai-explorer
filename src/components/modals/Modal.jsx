import React, { Component } from 'react';
import ReactModal from 'react-modal';
import web3 from  '../../web3';
import { wmul, wdiv } from '../../helpers';

class Modal extends Component {
  constructor() {
    super();
    this.state = {
      message: ''
    }
  }

  updateValue = (e) => {
    e.preventDefault();
    const value = this.updateVal !== 'undefined' && this.updateVal && typeof this.updateVal.value !== 'undefined' ? this.updateVal.value : false;
    const token = this.token !== 'undefined' && this.token && typeof this.token.value !== 'undefined' ? this.token.value : false;

    if (this.submitEnabled) {
      this.props.updateValue(value, token);
    }
  }

  setMax = (e) => {
    e.preventDefault();
    let value = web3.toBigNumber(0);
    switch(this.props.modal.method) {
      case 'join':
        value = wdiv(this.props.dai.gem.myBalance, this.props.dai.tub.per);
        break;
      case 'exit':
      case 'lock':
        value = this.props.dai.skr.myBalance;
        break;
      case 'free':
        value = this.props.dai.tub.cups[this.props.modal.cup].avail_skr_with_margin;
        break;
      case 'draw':
        value = this.props.dai.tub.cups[this.props.modal.cup].avail_dai_with_margin;
        break;
      case 'wipe':
        value = web3.BigNumber.min(this.props.dai.dai.myBalance, this.props.tab(this.props.dai.tub.cups[this.props.modal.cup]));
        break;
      case 'boom':
        value = this.props.dai.tub.avail_boom_skr.floor();
        break;
      case 'bust':
        value = this.props.dai.tub.avail_bust_skr.floor();
        break;
      default:
        break;
    }
    document.getElementById('inputValue').value = web3.fromWei(value).valueOf();
    this.cond(document.getElementById('inputValue').value);
  }

  renderYesNoForm = () => {
    return (
      <form>
        <p id="warningMessage" className="error">
          { this.props.modal.error }
        </p>
        <div className="yesno">
          <button type="submit" onClick={(e) => this.updateValue(e)}>Yes</button>
          <button type="submit" onClick={(e) => this.props.handleCloseModal(e)}>No</button>
        </div>
      </form>
    )
  }

  renderInputTextForm = () => {
    return this.renderInputForm('text', );
  }

  renderInputNumberForm = () => {
    return this.renderInputForm('number', );
  }

  renderInputForm = (type) => {
    return (
      <form ref={(input) => this.updateValueForm = input} onSubmit={(e) => this.updateValue(e)}>
        <input ref={(input) => this.updateVal = input} type={type} id="inputValue" required step="0.000000000000000001" onChange={ (e) => { this.cond(e.target.value) } } />
        {
          type === 'number'
          ? <span>&nbsp;<a href="#action" onClick={ this.setMax }>Set max</a></span>
          : ''
        }
        <p id="warningMessage" className="error">
          { this.props.modal.error }
        </p>
        <br />
        <input type="submit" />
      </form>
    )
  }

  render() {
    const modal = this.props.modal;
    const style = {
      overlay: {
        backgroundColor : 'rgba(0, 0, 0, 0.5)'
      },
      content: {
        border: 1,
        borderStyle: 'solid',
        borderRadius: '4px',
        borderColor: '#d2d6de',
        bottom: 'auto',
        height: 'auto',  // set height
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%', // start from center
        transform: 'translate(-50%,-50%)', // adjust top "up" based on height
        width: '40%',
        maxWidth: '40rem'
      }
    };

    let text = '';
    let renderForm = '';
    this.cond = () => { return false };
    switch(modal.method) {
      case 'proxy':
        text = '';
        text = '[ADD EXPLANATION WHAT IS A PROFILE].<br />' +
        'Are you sure you want to create a Profile?';
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'open':
        text = 'Are you sure you want to open a new CDP?';
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'shut':
        text = `Are you sure you want to close CDP ${modal.cup}?.`;
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing up to three transactions if there is not enough allowance in DAI and/or MKR to complete this transaction.';;
        }
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'bite':
        text = `Are you sure you want to bite CDP ${modal.cup}?`;
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'join':
        text = 'Please set amount of SKR you want to get in exchange of your WETH.';
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing two transactions if there is not enough allowance in WETH to complete this transaction.';
        }
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.gem.myBalance.lt(valueWei)) {
            error = 'Not enough balance to join this amount of WETH.';
            this.submitEnabled = false;
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'exit':
        if (this.props.off === true) {
          text = 'Are you sure you want to exit all your SKR?';
          if (!this.props.proxyEnabled) {
            text += '<br />You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
          }
          renderForm = 'renderYesNoForm';
          this.submitEnabled = true;
        } else {
          text = 'Please set amount of collateral (SKR) you want to convert to WETH.';
          if (!this.props.proxyEnabled) {
            text += '<br />You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
          }
          renderForm = 'renderInputNumberForm';

          this.cond = (value) => {
            const valueWei = web3.toBigNumber(web3.toWei(value));
            let error = '';
            this.submitEnabled = true;
            if (this.props.dai.skr.myBalance.lt(valueWei)) {
              error = 'Not enough balance to exit this amount of SKR.';
              this.submitEnabled = false;
            }
            document.getElementById('warningMessage').innerHTML = error;
          }
        }
        break;
      case 'boom':
        text = 'Please set amount of SKR you want to transfer to get DAI.';
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        }
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.tub.avail_boom_skr.lt(valueWei)) {
            error = 'Not enough SKR in the system to boom this amount of SKR.';
            this.submitEnabled = false;
          } else if (this.props.dai.skr.myBalance.lt(valueWei)) {
            error = 'Not enough balance of SKR to boom this amount of SKR.';
            this.submitEnabled = false;
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'bust':
        text = 'Please set amount of SKR you want to get in exchange of DAI.';
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing two transactions if there is not enough allowance in DAI to complete this transaction.';
        }
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueDAI = wmul(web3.toBigNumber(value), this.props.dai.tub.avail_bust_ratio);
          const valueDAIWei = web3.toBigNumber(web3.toWei(valueDAI)).floor();
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.tub.avail_bust_dai.lt(valueDAIWei)) {
            error = 'Not enough DAI in the system to bust this amount of SKR.';
            this.submitEnabled = false;
          } else if (this.props.dai.dai.myBalance.lt(valueDAIWei)) {
            error = 'Not enough balance of DAI to bust this amount of SKR.';
            this.submitEnabled = false;
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'lock':
        text = `Please set amount of collateral (SKR) you want to lock in CDP ${modal.cup}.`;
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing two transactions if there is not enough allowance in SKR to complete this transaction.';
        }
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.skr.myBalance.lt(valueWei)) {
            error = 'Not enough balance to lock this amount of SKR.';
            this.submitEnabled = false;
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'free':
        text = `Please set amount of collateral (SKR) you want to withdraw from CDP ${modal.cup}`;
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          const cup = this.props.modal.cup;
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.tub.cups[cup].avail_skr.lt(valueWei)) {
            error = 'This amount of SKR exceeds the maximum available to free.';
            this.submitEnabled = false;
          } else if (this.props.dai.tub.off === false && this.props.dai.tub.cups[cup].art.gt(0) && valueWei.gt(this.props.dai.tub.cups[cup].avail_skr.times(0.9))) {
            error = 'This amount puts your CDP in risk to be liquidated';
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'draw':
        text = `Please set amount of DAI you want to mint from your locked collateral (SKR) in CDP ${modal.cup}`;
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          const cup = this.props.modal.cup;
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.sin.totalSupply.add(valueWei).gt(this.props.dai.tub.hat)) {
            error = 'This amount of DAI exceeds the system debt ceiling.';
            this.submitEnabled = false;
          } else if (this.props.dai.tub.cups[cup].avail_dai.lt(valueWei)) {
            error = 'This amount of DAI exceeds the maximum available to draw.';
            this.submitEnabled = false;
          } else if (valueWei.gt(this.props.dai.tub.cups[cup].avail_dai.times(0.9))) {
            error = 'This amount puts your CDP in risk to be liquidated';
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'wipe':
        text = `Please set amount of DAI you want to burn to recover your collateral (SKR) from CDP ${modal.cup}.`;
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing up to three transactions if there is not enough allowance in DAI and/or MKR to complete this transaction.';
        }
        renderForm = 'renderInputNumberForm';
        this.cond = (value) => {
          const valueWei = web3.toBigNumber(web3.toWei(value));
          const cup = this.props.modal.cup;
          let error = '';
          this.submitEnabled = true;
          if (this.props.dai.dai.myBalance.lt(valueWei)) {
            error = 'Not enough balance of DAI to wipe this amount.';
            this.submitEnabled = false;
          } else if (this.props.tab(this.props.dai.tub.cups[cup]).lt(valueWei)) {
            error = `Debt in CDP ${cup} is lower than this amount of DAI.`;
            this.submitEnabled = false;
          } else {
            const futureGovFee = web3.fromWei(wdiv(this.props.dai.tub.fee, this.props.dai.tub.tax)).pow(180).round(0); // 3 minutes of future fee
            const govDebt = wmul(
                              wmul(
                                wmul(
                                  valueWei,
                                  wdiv(
                                    this.props.rap(this.props.dai.tub.cups[cup]),
                                    this.props.tab(this.props.dai.tub.cups[cup])
                                  )
                                ),
                                this.props.dai.pep.val
                              ),
                              futureGovFee
                            );
            if (govDebt.gt(this.props.dai.gov.myBalance)) {
              error = `Not enough balance of MKR to wipe this amount.`;
              this.submitEnabled = false;
            }
          }
          document.getElementById('warningMessage').innerHTML = error;
        }
        break;
      case 'give':
        text = `Please set the new address to be owner of CDP ${modal.cup}`;
        renderForm = 'renderInputTextForm';
        this.submitEnabled = true;
        break;
      case 'cash':
        text = 'Are you sure you want to cash?';
        if (!this.props.proxyEnabled) {
          text += '<br />You might be requested for signing two transactions if there is not enough allowance in DAI to complete this transaction.';
        }
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'vent':
        text = 'Are you sure you want to vent the system?';
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'drip':
        text = 'Are you sure you want to drip the system?';
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      case 'heal':
        text = 'Are you sure you want to heal the system?';
        renderForm = 'renderYesNoForm';
        this.submitEnabled = true;
        break;
      default:
        break;
    }

    return (
      <ReactModal
          isOpen={ modal.show }
          contentLabel="Action Modal"
          style={ style } >
        <a href="#action" className="close" onClick={ this.props.handleCloseModal }>X</a>
        <div>
          <p dangerouslySetInnerHTML={{__html: text}} />
          { renderForm ? this[renderForm]() : '' }
        </div>
      </ReactModal>
    )
  }
}

export default Modal;
