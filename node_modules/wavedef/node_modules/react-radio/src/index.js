import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

const emptyFn = () => {}

export default class ReactRadioGroup extends Component {

    constructor(props){
        super(props)

        this.state = {
            defaultValue: props.defaultValue
        }
    }

    componentDidUpdate() {
        if (!this.shouldGenerateChildren()){
            this.setRadioNames()
            this.setCheckedRadio()
        }
    }

    componentDidMount() {
        if (!this.shouldGenerateChildren()){
            this.setRadioNames()
            this.setCheckedRadio()
        }
    }

    setCheckedRadio(){
        const value = this.props.value != null?
                        this.props.value:
                        this.state.defaultValue

        this.someRadio(function(radio){
            if (radio.value == value){
                radio.checked = true
                return true
            }
        })
    }

    setRadioNames() {
        this.forEachRadio(function(radio){
            radio.setAttribute('name', this.props.name)
        })
    }

    someRadio(fn){
        const $radios = this.getRadios()

        return [].some.call($radios, fn, this)
    }

    forEachRadio(fn) {
        const $radios = this.getRadios()

        return [].forEach.call($radios, fn, this)
    }

    getRadios() {
        return findDOMNode(this).querySelectorAll('input[type="radio"]')
    }

    render(){
        var props = this.prepareProps(this.props, this.state)

        return <div {...props} />
    }

    getValue() {
        if (this.value == undefined){
            this.value = this.state.defaultValue
        }

        return this.value
    }

    handleChange(event) {
        var target = event.target
        var fn     = this.props.onChange || emptyFn
        var value  = this.value = target.value

        fn(value, event)

        if (this.props.value == null){
            this.setState({
                defaultValue: value
            })
        }
    }

    shouldGenerateChildren() {
        return !this.props.children
    }

    prepareProps(thisProps, state) {

        var props = {}

        assign(props, thisProps)

        if (this.shouldGenerateChildren()){
            props.labelStyle = this.prepareLabelStyle(props, state)
            props.inputStyle = this.prepareInputStyle(props, state)
            props.children   = this.prepareChildren(props, state)
        }

        props.onChange = this.handleChange

        return props
    }

    prepareLabelStyle(props) {
        return assign({}, props.defaultLabelStyle, props.labelStyle)
    }

    prepareInputStyle(props) {
        return assign({}, props.defaultInputStyle, props.inputStyle)
    }

    prepareChildren(props, state) {

        var checkedValue = props.value != null?
                            props.value:
                            state.defaultValue

        return (props.items || []).map((item, index, arr) => {

            var inputStyle = assign({}, props.inputStyle)
            var labelStyle = assign({}, props.labelStyle)
            var disabledStyle = assign({}, props.disabledStyle)
            var disabled = false
            var checked
            var value
            var children

            if (typeof item === 'string'){
                value    = item
                checked  = checkedValue == value
                children = item
            } else {
                value    = item.value
                children = item.label || item.value
                checked  = checkedValue == value
                disabled = !!item.disabled

                if (item.inputStyle){
                    assign(inputStyle, item.inputStyle)
                }
                if (item.style){
                    assign(labelStyle, item.style)
                }
            }

            if (disabled){

              assign(inputStyle, props.disabledInputStyle)
              assign(labelStyle, props.disabledStyle, props.disabledLabelStyle)

              if (item && item.disabledStyle){
                assign(labelStyle, item.disabledStyle)
              }
            }

            if (checked){
                assign(inputStyle, props.checkedInputStyle)
                assign(labelStyle, props.checkedLabelStyle)

                if (item && item.checkedStyle){
                    assign(labelStyle, item.checkedStyle)
                }
            }

            var inputProps = {
                checked : checked,
                value   : value,
                name    : props.name,
                type    : 'radio',
                disabled: disabled,
                style   : inputStyle,
                onChange: emptyFn
            }

            var radioProps = {
                key       : index,
                checked   : checked,
                index     : index,
                name      : props.name,
                value     : value,
                style     : labelStyle,
                inputProps: inputProps,
                label     : children,
                item      : item,
                children  : [
                    <input {...inputProps}/>,
                    children
                ]
            }

            var renderFn = props.renderRadio
            var result

            if (renderFn){
                result = renderFn(radioProps, index, arr)
            }

            if (result === undefined){
                result = <label {...radioProps} />
            }

            return result
        })
    }
}

ReactRadioGroup.defaultProps = {
  defaultLabelStyle: {
      cursor: 'pointer'
  },
  defaultInputStyle: {
      cursor: 'pointer'
  }
}

ReactRadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    items(props, name){
        if (!props.children && !props.items){
            return new Error('Your component has no children. In this case, you should specify an items array.')
        }
    }
}
