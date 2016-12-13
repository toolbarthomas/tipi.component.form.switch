function setUnifiedSwitch()
{
	var data = {
		elements : {
			'switch' : 'switch',
			'control' : 'switch-control',
			'label'	: 'label',
			'input' : 'input:checkbox'
		},
		states : {
			'ready' : '__switch--ready',
			'focus' : '__switch--focus',
			'active' : '__switch--active',
			'disabled' : '__switch--disabled'
		},
		attributes : {
			disabled: 'disabled',
			checked : 'checked'
		}
	}

	var unified_switch = $('.' + data.elements.switch).not('.' + data.states.ready);
	if(unified_switch.length === 0)
	{
		return;
	}

	unified_switch.on({
		'tipi.unified-switch.reset' : function(event, unified_switch)
		{
			setUnifiedSwitchDisabledState(unified_switch, data);
			setUnifiedSwitchCheckedState(unified_switch, data);
		},
		'tipi.unified-switch.toggle' : function(event, unified_switch)
		{
			toggleUnifiedSwitch(unified_switch, data);
		},
		'tipi.unified-switch.focus' : function(event, unified_switch)
		{
			focusUnifiedSwitch(unified_switch, data);
		},
		'tipi.unified-switch.blur' : function(event, unified_switch)
		{
			blurUnifiedSwitch(unified_switch, data);
		},
		'tipi.unified-switch.change' : function(event, unified_switch)
		{
			setUnifiedSwitchCheckedState(unified_switch, data);
		}
	});

	unified_switch.each(function() {
		var unified_switch = $(this);
		var unified_switch_control = getUnifiedSwitchElement(unified_switch, 'control', data);
		var input = getUnifiedSwitchElement(unified_switch, 'input', data);

		if(input.length === 0)
		{
			return;
		}

		unified_switch.on({
			click : function(event) {
				event.preventDefault();

				//Toggle the checked state on the wrapped input
				unified_switch.trigger('tipi.unified-switch.toggle', [$(this)]);
			}
		});

		input.on({
			click : function(event)
			{
				//Cancels out the click event that is being triggerd by clicking on the corresponding label or controlling the input with the keyboard.
				event.stopImmediatePropagation();
			},
			focus : function(event) {
				event.preventDefault();

				var unified_switch = getUnifiedSwitchElement($(this), 'switch', data);
				if(unified_switch.length === 0) {
					return;
				}

				//Set the focus state while focusing the input
				unified_switch.trigger('tipi.unified-switch.focus', [unified_switch]);
			},
			blur : function(event) {
				event.preventDefault();

				var unified_switch = getUnifiedSwitchElement($(this), 'switch', data);
				if(unified_switch.length === 0) {
					return;
				}

				//Remove the focus state while focusing the input
				unified_switch.trigger('tipi.unified-switch.blur', [unified_switch]);
			},
			change : function(event)  {
				var unified_switch = getUnifiedSwitchElement($(this), 'switch', data);
				if(unified_switch.length === 0) {
					return;
				}

				//Toggle the active state on the root container when the input has changed
				unified_switch.trigger('tipi.unified-switch.change', [unified_switch]);
			}
		});

		//Set the corresponding states based on the given attributes on the input
		unified_switch.trigger('tipi.unified-switch.reset', [unified_switch]);

		//Our switch is ready!
		unified_switch.addClass(data.states.ready);
	});
}

function toggleUnifiedSwitch(unified_switch, data)
{
	var input = getUnifiedSwitchElement(unified_switch, 'input', data);

	if(input.length === 0)
	{
		return;
	}

	if(input.prop(data.attributes.disabled))
	{
		return;
	}

	var checked = true;
	if(input.prop(data.attributes.checked))
	{
		checked = false;
	}

	input.prop(data.attributes.checked, checked);

	input.trigger('change');
}

function setUnifiedSwitchCheckedState(unified_switch, data)
{
	var input = getUnifiedSwitchElement(unified_switch, 'input', data);

	if(input.length === 0)
	{
		return;
	}

	if(input.prop(data.attributes.checked))
	{
		unified_switch.addClass(data.states.active);
	}
	else
	{
		unified_switch.removeClass(data.states.active);
	}
}

function focusUnifiedSwitch(unified_switch, data)
{
	var input = getUnifiedSwitchElement(unified_switch, 'input', data);

	if(input.length === 0)
	{
		return;
	}

	unified_switch.addClass(data.states.focus);
}

function blurUnifiedSwitch(unified_switch, data)
{
	var input = getUnifiedSwitchElement(unified_switch, 'input', data);

	if(input.length === 0)
	{
		return;
	}

	unified_switch.removeClass(data.states.focus);
}

function setUnifiedSwitchDisabledState(unified_switch, data)
{
	var input = getUnifiedSwitchElement(unified_switch, 'input', data);

	if(input.length === 0)
	{
		return;
	}

	if(input.prop(data.attributes.disabled))
	{
		unified_switch.addClass(data.states.disabled);
	}
	else
	{
		unified_switch.removeClass(data.states.disabled);
	}
}

function getUnifiedSwitchElement(origin, type, data)
{
	if(typeof origin == 'undefined')
	{
		return;
	}

	if(origin.length == 0)
	{
		return;
	}

	if(typeof data.elements == 'undefined')
	{
		return;
	}

	var element = {};

	switch(type) {
		case 'switch':
			element = origin.parents('.' + data.elements.switch).first();
		break;
		case 'control':
			element = origin.find('.' + data.elements.control).first();
		break;
		case 'label':
			element = origin.find(data.elements.label);
		break;
		case 'input':
			element = origin.find(data.elements.input).first();
		break;
		default:
			element.length = 0;
	}

	return element;
}