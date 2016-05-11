'use strict';

import { render } from 'react-dom'
import RadioGroup from './src'

var items = [
    {
        value: 'apple',
        label: <b>Apple</b>
    },
    {
        value: 'test',
        disabled: true
    },
    'orange',
    'watermelon'
]

var VALUE = 'watermelon'

var App = React.createClass({

    onChange: function(value){
        VALUE = value
        this.setState({})
    },

    renderRadio: function(props, index, arr){
        props.children[0] = props.checked? 'x' : 'o'
        //props.children.push(...) you could also add a
        //hidden input for the value, if you need to submitzzz
        // props.onClick = this.onChange.bind(this, props.value)
    },

    render: function() {

        var style = {
            width: '50%'
        }


        return (
            <div className="App"
                style={{margin: 20, display: 'inline-block'}}
            >
                <RadioGroup
                    checkedLabelStyle={{color: 'magenta'}}
                    value={VALUE}
                    onChange={this.onChange}
                    labelStyle={{padding: 10}}
                    name="values"
                    items={items}
                    xrenderRadio={this.renderRadio}
                />
            </div>
        )
    }
})

render(<App />, document.getElementById('content'))
