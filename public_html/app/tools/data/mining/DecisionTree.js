/**
 * @class DecisionTree
 *
 * @author Mauro Trevisan
 */
define(['tools/data/mining/DecisionTreeContext', 'tools/data/ObjectHelper'], function(DecisionTreeContext, ObjectHelper){

	var Constructor = function(attributes, data){
		this.fullContext = new DecisionTreeContext(attributes, data);
	};


	var attachSupervisor = function(fnSupervisorConfirmClass, fnSupervisorAskBranch, fnSupervisorAskNewAttributeAndClass){
		this.supervisor = {
			supervisedInstance: [],
			questionOrder: [],

			confirmClass: fnSupervisorConfirmClass,
			askBranch: fnSupervisorAskBranch,
			askNewAttributeAndClass: fnSupervisorAskNewAttributeAndClass
		};
	};

	/** Running time in the worst case is O(|data| * |attributes|^2) */
	var buildTree = function(){
		this.root = {};

		var stack = [{
			node: this.root,
			context: this.fullContext
		}];

		if(this.supervisor)
			chooseNextNode.call(this, stack);
		else{
			var current;
			while(current = stack.pop())
				buildNode.call(this, current.node, current.context, stack);

			return this.root;
		}
	};

	/** @private */
	var chooseNextNode = function(stack){
		var current = stack.pop();

		buildNode.call(this, current.node, current.context, stack);
	};

	/** @private */
	var buildNode = function(node, context, stack){
		var self = this;

		//store the set of data instances along with the node
		node.data = ObjectHelper.clone(context.getData());

		var sameClass = context.belongsToSameClass();
		if(sameClass){
			//create a leaf node saying to choose that class
			node['class'] = sameClass;

			//ask supervisor for correctness
			if(self.supervisor)
				confirmClass(self, node);
		}
		else{
			var info = context.selectAttributeWithHighestGain();

			if(self.supervisor){
				//ask supervisor which branch should be followed
				if(info.attribute)
					askBranch(self, node, context, stack, info);
				//no branches to follow
				else
					//ask supervisor for this newly discovered class
					askNewAttributeAndClass(self);
			}
			else if(info.attribute){
				splitDataInstances(context, info);

				loadNextSubContext(node, context, stack, info, ['EQ', 'NE', 'LT', 'GE']);
			}
		}
	};

	/** @private */
	var loadNextSubContext = function(node, context, stack, info, conditions){
		//create a decision node that splits on the best attribute with the highest normalized information gain
		//recurse on the sublists obtained by splitting on the best attribute, and add those nodes as children of node
		node.children = [];

		var hasData = false;

		conditions.forEach(function(condition){
			var instances = info['instances' + condition];
			if(instances && instances.length){
				hasData = true;

				var child = {
						rule: {
							index: info.attributeIndex,
							condition: condition,
							value: info.cutPoint,

							accept: fnRuleAccept
						}
					},
					subContext = context.clone(instances);

				node.children.push(child);

				stack.push({
					node: child,
					context: subContext
				});
			}
		});

		return hasData;
	};

	var getSupervisedInstance = function(){
		return (this.supervisor? this.supervisor.supervisedInstance: undefined);
	};

	var getQuestionOrder = function(){
		return (this.supervisor? this.supervisor.questionOrder: undefined);
	};

	/** @private */
	var confirmClass = function(scope, node){
		scope.supervisor.confirmClass(node['class']).then(function(correct){
			if(correct){
				//TODO
				//add supervised instance to data set (watch for compiled field that are unknown in the former data set!)
				//...

				console.log('add instance ' + scope.supervisor.supervisedInstance + ' with class ' + node['class']);
			}
			else
				//ask supervisor for this newly discovered class
				askNewAttributeAndClass(scope);
		});
	};

	/** @private */
	var askBranch = function(scope, node, context, stack, info){
		scope.supervisor.askBranch(info.attribute.name, info.cutPoint, info.attribute.discrete).then(function(condition){
			if(condition){
				splitDataInstances(context, info);

				//follow only one branch
				var hasData = loadNextSubContext(node, context, stack, info, [condition]);

				if(scope.supervisor){
					if(hasData){
						//store path followed so far
						scope.supervisor.supervisedInstance[info.attributeIndex] = Number(info.cutPoint);
						scope.supervisor.questionOrder.push(info.attributeIndex);
					}
					//no branches to follow
					else
						//ask supervisor for this newly discovered class
						askNewAttributeAndClass(scope);
				}
			}
			else{
				context.ignoreAttribute(info.attributeIndex);

				//retry corrent node
				stack.push({
					node: node,
					context: context
				});
			}

			chooseNextNode.call(scope, stack);
		});
	};

	/** @private */
	var askNewAttributeAndClass = function(scope){
		scope.supervisor.askNewAttributeAndClass().then(function(newClass){
			//TODO
			//add instance with this condition verified
			//...

			console.log('add new instance ' + scope.supervisor.supervisedInstance + ' with new class ' + newClass);
		});
	};

	/** @private */
	var splitDataInstances = function(context, info){
		//discrete variable case
		if(info.attribute.discrete){
			info.instancesEQ = [];
			info.instancesNE = [];
			context.getData().forEach(function(dataInstance){
				//add instances satisfying rule
				if(dataInstance[this.attributeIndex] == this.cutPoint)
					this.instancesEQ.push(dataInstance);
				else
					this.instancesNE.push(dataInstance);
			}, info);
		}
		//real variable case
		else{
			info.instancesLT = [];
			info.instancesGE = [];
			context.getData().forEach(function(dataInstance){
				//add instances satisfying rule
				if(dataInstance[this.attributeIndex] < this.cutPoint)
					this.instancesLT.push(dataInstance);
				else
					this.instancesGE.push(dataInstance);
			}, info);
		}
	};

	/** @private */
	var fnRuleAccept = function(instance){
		var val = instance[this.index];
		switch(this.condition){
			case 'EQ':
				return (val == this.value);
			case 'NE':
				return (val != this.value);
			case 'LT':
				return (val < this.value);
			case 'GE':
				return (val >= this.value);
		}
	};


	Constructor.prototype = {
		constructor: Constructor,

		attachSupervisor: attachSupervisor,
		buildTree: buildTree,

		//updateTree: updateTree,
		getRoot: function(){ return this.root; },
		getSupervisedInstance: getSupervisedInstance,
		getQuestionOrder: getQuestionOrder
	};

	return Constructor;

});
