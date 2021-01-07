sap.ui.define([
	"jquery.sap.global",
	"sap/m/Input",
	"sap/m/InputRenderer",
	"sap/m/InputBase"
	], function(jQuery, Input, InputRenderer, InputBase) {
	"use strict";
	
	var oInput = Input.extend("nep.component.input.Input", {
   		metadata : {
			properties : {}
		},
		renderer : InputRenderer
	});

	Input.prototype.oninput = function(oEvent) {
		InputBase.prototype.oninput.call(this, oEvent);
		if (oEvent.isMarked("invalid")) {
			return true;
		}
		
//		if(this.getValueState() === "Error") {
//			$(this.getDomRef()).find('input').focus();
//			return false;
//		}
		
		var value = this.getDOMValue();
		
        // custom - check max length start
		var charCode;
        var iMaxLength = (this.getMaxLength() <= 0) ? -1 : this.getMaxLength();
        var sMsgOver = nep.I18n.getText("MaxInputLengthOver");
		
        if(iMaxLength > 0 && this.getMetadata().getName() === "nep.component.input.Input") {
			for (var i = 0; i < value.length; i++) {
				charCode = value.charAt(i);
	
				var check_num = /[0-9]/;
				var check_spc = /[~!@#$%^&*()_+|<>?:{}]/;
				var check_eng = /[a-zA-Z]/;
				var check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	
	            if(check_num.test(charCode) || check_spc.test(charCode) || check_eng.test(charCode))
	                iMaxLength -= 1;
				if(check_kor.test(charCode))
				    iMaxLength -= 3;
	            
	            if(0 > iMaxLength){
	            	this.setValueStateText(sMsgOver);
	                this.setValueState(sap.ui.core.ValueState.Error);
	                this.setValue(value.substr(0, i + 1));
	                return false;
	            }
			}
        }
        //maxlength check 
        if(this.getValueStateText().indexOf(sMsgOver) > -1) {
        	this.setValueState(sap.ui.core.ValueState.None);
        }
        
        // custom - check max length end
		if (this.getValueLiveUpdate()) {
			this.setProperty("value", value, true);
			this._onValueUpdated(value);
		}

		this.fireLiveChange({
			value: value,
			// backwards compatibility
			newValue: value
		});

		// No need to fire suggest event when suggestion feature isn't enabled or runs on the phone.
		// Because suggest event should only be fired by the input in dialog when runs on the phone.
		if (this.getShowSuggestion() && !this._bUseDialog) {
			this._triggerSuggest(value);
		}
		return true;
	};
	return oInput;
}, true);
