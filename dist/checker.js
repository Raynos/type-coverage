"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
function collectAny(node, { file, sourceFile, typeCheckResult, ingoreMap, debug, detail }) {
    const { line, character } = typescript_1.default.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    if (ingoreMap[file] && ingoreMap[file].has(line)) {
        return false;
    }
    if (debug) {
        console.log(`type === any: ${file}:${line + 1}:${character + 1}: ${node.getText(sourceFile)}`);
    }
    else if (detail) {
        typeCheckResult.anys.push({ line, character, text: node.getText(sourceFile) });
    }
    return true;
}
function collectNotAny(node, { file, sourceFile, typeCheckResult, debug }, type) {
    typeCheckResult.correctCount++;
    if (debug) {
        const { line, character } = typescript_1.default.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
        console.log(`type !== any: ${file}:${line + 1}:${character + 1}: ${node.getText(sourceFile)} ${node.kind}(kind) ${type.flags}(flag) ${type.intrinsicName || ''}`);
    }
}
function collectData(node, context) {
    const type = context.checker.getTypeAtLocation(node);
    if (type) {
        context.typeCheckResult.totalCount++;
        if (typeIsStrictAny(type, context.strict)) {
            const success = collectAny(node, context);
            if (!success) {
                collectNotAny(node, context, type);
            }
        }
        else {
            collectNotAny(node, context, type);
        }
    }
}
function typeIsStrictAny(type, strict) {
    if (type.flags === typescript_1.default.TypeFlags.Any) {
        return type.intrinsicName === 'any';
    }
    if (strict && type.flags === typescript_1.default.TypeFlags.Object) {
        const typeArguments = type.typeArguments;
        if (typeArguments) {
            return typeArguments.some((typeArgument) => typeIsStrictAny(typeArgument, strict));
        }
    }
    return false;
}
function checkNodes(nodes, context) {
    if (nodes === undefined) {
        return;
    }
    for (const node of nodes) {
        checkNode(node, context);
    }
}
// tslint:disable-next-line:no-big-function
function checkNode(node, context) {
    if (node === undefined) {
        return;
    }
    if (context.debug) {
        const { line, character } = typescript_1.default.getLineAndCharacterOfPosition(context.sourceFile, node.getStart(context.sourceFile));
        console.log(`node: ${context.file}:${line + 1}:${character + 1}: ${node.getText(context.sourceFile)} ${node.kind}(kind)`);
    }
    checkNodes(node.decorators, context);
    checkNodes(node.modifiers, context);
    // tslint:disable-next-line:max-switch-cases
    switch (node.kind) {
        case typescript_1.default.SyntaxKind.Unknown:
        case typescript_1.default.SyntaxKind.EndOfFileToken:
        case typescript_1.default.SyntaxKind.SingleLineCommentTrivia:
        case typescript_1.default.SyntaxKind.MultiLineCommentTrivia:
        case typescript_1.default.SyntaxKind.NewLineTrivia:
        case typescript_1.default.SyntaxKind.WhitespaceTrivia:
        case typescript_1.default.SyntaxKind.ShebangTrivia:
        case typescript_1.default.SyntaxKind.ConflictMarkerTrivia:
        case typescript_1.default.SyntaxKind.NumericLiteral:
        case typescript_1.default.SyntaxKind.StringLiteral:
        case typescript_1.default.SyntaxKind.JsxText:
        case typescript_1.default.SyntaxKind.JsxTextAllWhiteSpaces:
        case typescript_1.default.SyntaxKind.RegularExpressionLiteral:
        case typescript_1.default.SyntaxKind.NoSubstitutionTemplateLiteral:
        case typescript_1.default.SyntaxKind.TemplateHead:
        case typescript_1.default.SyntaxKind.TemplateMiddle:
        case typescript_1.default.SyntaxKind.TemplateTail:
        case typescript_1.default.SyntaxKind.OpenBraceToken:
        case typescript_1.default.SyntaxKind.CloseBraceToken:
        case typescript_1.default.SyntaxKind.OpenParenToken:
        case typescript_1.default.SyntaxKind.CloseParenToken:
        case typescript_1.default.SyntaxKind.OpenBracketToken:
        case typescript_1.default.SyntaxKind.CloseBracketToken:
        case typescript_1.default.SyntaxKind.DotToken:
        case typescript_1.default.SyntaxKind.DotDotDotToken:
        case typescript_1.default.SyntaxKind.SemicolonToken:
        case typescript_1.default.SyntaxKind.CommaToken:
        case typescript_1.default.SyntaxKind.LessThanToken:
        case typescript_1.default.SyntaxKind.LessThanSlashToken:
        case typescript_1.default.SyntaxKind.GreaterThanToken:
        case typescript_1.default.SyntaxKind.LessThanEqualsToken:
        case typescript_1.default.SyntaxKind.GreaterThanEqualsToken:
        case typescript_1.default.SyntaxKind.EqualsEqualsToken:
        case typescript_1.default.SyntaxKind.ExclamationEqualsToken:
        case typescript_1.default.SyntaxKind.EqualsEqualsEqualsToken:
        case typescript_1.default.SyntaxKind.ExclamationEqualsEqualsToken:
        case typescript_1.default.SyntaxKind.EqualsGreaterThanToken:
        case typescript_1.default.SyntaxKind.PlusToken:
        case typescript_1.default.SyntaxKind.MinusToken:
        case typescript_1.default.SyntaxKind.AsteriskToken:
        case typescript_1.default.SyntaxKind.AsteriskAsteriskToken:
        case typescript_1.default.SyntaxKind.SlashToken:
        case typescript_1.default.SyntaxKind.PercentToken:
        case typescript_1.default.SyntaxKind.PlusPlusToken:
        case typescript_1.default.SyntaxKind.MinusMinusToken:
        case typescript_1.default.SyntaxKind.LessThanLessThanToken:
        case typescript_1.default.SyntaxKind.GreaterThanGreaterThanToken:
        case typescript_1.default.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
        case typescript_1.default.SyntaxKind.AmpersandToken:
        case typescript_1.default.SyntaxKind.BarToken:
        case typescript_1.default.SyntaxKind.CaretToken:
        case typescript_1.default.SyntaxKind.ExclamationToken:
        case typescript_1.default.SyntaxKind.TildeToken:
        case typescript_1.default.SyntaxKind.AmpersandAmpersandToken:
        case typescript_1.default.SyntaxKind.BarBarToken:
        case typescript_1.default.SyntaxKind.QuestionToken:
        case typescript_1.default.SyntaxKind.ColonToken:
        case typescript_1.default.SyntaxKind.AtToken:
        case typescript_1.default.SyntaxKind.EqualsToken:
        case typescript_1.default.SyntaxKind.PlusEqualsToken:
        case typescript_1.default.SyntaxKind.MinusEqualsToken:
        case typescript_1.default.SyntaxKind.AsteriskEqualsToken:
        case typescript_1.default.SyntaxKind.AsteriskAsteriskEqualsToken:
        case typescript_1.default.SyntaxKind.SlashEqualsToken:
        case typescript_1.default.SyntaxKind.PercentEqualsToken:
        case typescript_1.default.SyntaxKind.LessThanLessThanEqualsToken:
        case typescript_1.default.SyntaxKind.GreaterThanGreaterThanEqualsToken:
        case typescript_1.default.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
        case typescript_1.default.SyntaxKind.AmpersandEqualsToken:
        case typescript_1.default.SyntaxKind.BarEqualsToken:
        case typescript_1.default.SyntaxKind.CaretEqualsToken:
            break;
        case typescript_1.default.SyntaxKind.Identifier:
            const id = node;
            if (context.catchVariables[id.escapedText]) {
                return;
            }
            collectData(node, context);
            break;
        case typescript_1.default.SyntaxKind.BreakKeyword:
        case typescript_1.default.SyntaxKind.CaseKeyword:
        case typescript_1.default.SyntaxKind.CatchKeyword:
        case typescript_1.default.SyntaxKind.ClassKeyword:
        case typescript_1.default.SyntaxKind.ConstKeyword:
        case typescript_1.default.SyntaxKind.ContinueKeyword:
        case typescript_1.default.SyntaxKind.DebuggerKeyword:
        case typescript_1.default.SyntaxKind.DefaultKeyword:
        case typescript_1.default.SyntaxKind.DeleteKeyword:
        case typescript_1.default.SyntaxKind.DoKeyword:
        case typescript_1.default.SyntaxKind.ElseKeyword:
        case typescript_1.default.SyntaxKind.EnumKeyword:
        case typescript_1.default.SyntaxKind.ExportKeyword:
        case typescript_1.default.SyntaxKind.ExtendsKeyword:
        case typescript_1.default.SyntaxKind.FalseKeyword:
        case typescript_1.default.SyntaxKind.FinallyKeyword:
        case typescript_1.default.SyntaxKind.ForKeyword:
        case typescript_1.default.SyntaxKind.FunctionKeyword:
        case typescript_1.default.SyntaxKind.IfKeyword:
        case typescript_1.default.SyntaxKind.ImportKeyword:
        case typescript_1.default.SyntaxKind.InKeyword:
        case typescript_1.default.SyntaxKind.InstanceOfKeyword:
        case typescript_1.default.SyntaxKind.NewKeyword:
        case typescript_1.default.SyntaxKind.NullKeyword:
        case typescript_1.default.SyntaxKind.ReturnKeyword:
        case typescript_1.default.SyntaxKind.SuperKeyword:
        case typescript_1.default.SyntaxKind.SwitchKeyword:
            break;
        case typescript_1.default.SyntaxKind.ThisKeyword:
            collectData(node, context);
            break;
        case typescript_1.default.SyntaxKind.ThrowKeyword:
        case typescript_1.default.SyntaxKind.TrueKeyword:
        case typescript_1.default.SyntaxKind.TryKeyword:
        case typescript_1.default.SyntaxKind.TypeOfKeyword:
        case typescript_1.default.SyntaxKind.VarKeyword:
        case typescript_1.default.SyntaxKind.VoidKeyword:
        case typescript_1.default.SyntaxKind.WhileKeyword:
        case typescript_1.default.SyntaxKind.WithKeyword:
        case typescript_1.default.SyntaxKind.ImplementsKeyword:
        case typescript_1.default.SyntaxKind.InterfaceKeyword:
        case typescript_1.default.SyntaxKind.LetKeyword:
        case typescript_1.default.SyntaxKind.PackageKeyword:
        case typescript_1.default.SyntaxKind.PrivateKeyword:
        case typescript_1.default.SyntaxKind.ProtectedKeyword:
        case typescript_1.default.SyntaxKind.PublicKeyword:
        case typescript_1.default.SyntaxKind.StaticKeyword:
        case typescript_1.default.SyntaxKind.YieldKeyword:
        case typescript_1.default.SyntaxKind.AbstractKeyword:
        case typescript_1.default.SyntaxKind.AsKeyword:
        case typescript_1.default.SyntaxKind.AnyKeyword:
        case typescript_1.default.SyntaxKind.AsyncKeyword:
        case typescript_1.default.SyntaxKind.AwaitKeyword:
        case typescript_1.default.SyntaxKind.BooleanKeyword:
        case typescript_1.default.SyntaxKind.ConstructorKeyword:
        case typescript_1.default.SyntaxKind.DeclareKeyword:
        case typescript_1.default.SyntaxKind.GetKeyword:
        case typescript_1.default.SyntaxKind.IsKeyword:
        case typescript_1.default.SyntaxKind.KeyOfKeyword:
        case typescript_1.default.SyntaxKind.ModuleKeyword:
        case typescript_1.default.SyntaxKind.NamespaceKeyword:
        case typescript_1.default.SyntaxKind.NeverKeyword:
        case typescript_1.default.SyntaxKind.ReadonlyKeyword:
        case typescript_1.default.SyntaxKind.RequireKeyword:
        case typescript_1.default.SyntaxKind.NumberKeyword:
        case typescript_1.default.SyntaxKind.ObjectKeyword:
        case typescript_1.default.SyntaxKind.SetKeyword:
        case typescript_1.default.SyntaxKind.StringKeyword:
        case typescript_1.default.SyntaxKind.SymbolKeyword:
        case typescript_1.default.SyntaxKind.TypeKeyword:
        case typescript_1.default.SyntaxKind.UndefinedKeyword:
        case typescript_1.default.SyntaxKind.UniqueKeyword:
        case typescript_1.default.SyntaxKind.UnknownKeyword:
        case typescript_1.default.SyntaxKind.FromKeyword:
        case typescript_1.default.SyntaxKind.GlobalKeyword:
        case typescript_1.default.SyntaxKind.BigIntKeyword:
        case typescript_1.default.SyntaxKind.OfKeyword:
            break;
        case typescript_1.default.SyntaxKind.QualifiedName:
            const qualifiedName = node;
            checkNode(qualifiedName.left, context);
            checkNode(qualifiedName.right, context);
            break;
        case typescript_1.default.SyntaxKind.ComputedPropertyName:
            const computedPropertyName = node;
            checkNode(computedPropertyName.expression, context);
            break;
        case typescript_1.default.SyntaxKind.TypeParameter:
            const typeParameterDeclaration = node;
            checkNode(typeParameterDeclaration.name, context);
            checkNode(typeParameterDeclaration.default, context);
            checkNode(typeParameterDeclaration.expression, context);
            checkNode(typeParameterDeclaration.constraint, context);
            break;
        case typescript_1.default.SyntaxKind.Parameter:
            const parameterDeclaration = node;
            checkNode(parameterDeclaration.dotDotDotToken, context);
            checkNode(parameterDeclaration.name, context);
            checkNode(parameterDeclaration.initializer, context);
            checkNode(parameterDeclaration.type, context);
            checkNode(parameterDeclaration.questionToken, context);
            break;
        case typescript_1.default.SyntaxKind.Decorator:
            const decorator = node;
            checkNode(decorator.expression, context);
            break;
        case typescript_1.default.SyntaxKind.PropertySignature:
            const propertySignature = node;
            checkNode(propertySignature.name, context);
            checkNode(propertySignature.questionToken, context);
            checkNode(propertySignature.type, context);
            checkNode(propertySignature.initializer, context);
            break;
        case typescript_1.default.SyntaxKind.PropertyDeclaration:
            const propertyDeclaration = node;
            checkNode(propertyDeclaration.name, context);
            checkNode(propertyDeclaration.initializer, context);
            checkNode(propertyDeclaration.type, context);
            checkNode(propertyDeclaration.questionToken, context);
            break;
        case typescript_1.default.SyntaxKind.MethodSignature:
            const methodSignature = node;
            checkNode(methodSignature.name, context);
            checkNodes(methodSignature.parameters, context);
            checkNode(methodSignature.questionToken, context);
            checkNode(methodSignature.type, context);
            checkNodes(methodSignature.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.MethodDeclaration:
        case typescript_1.default.SyntaxKind.Constructor:
        case typescript_1.default.SyntaxKind.GetAccessor:
        case typescript_1.default.SyntaxKind.SetAccessor:
            const functionLikeDeclarationBase = node;
            checkNode(functionLikeDeclarationBase.name, context);
            checkNodes(functionLikeDeclarationBase.parameters, context);
            checkNode(functionLikeDeclarationBase.body, context);
            checkNode(functionLikeDeclarationBase.asteriskToken, context);
            checkNode(functionLikeDeclarationBase.questionToken, context);
            checkNode(functionLikeDeclarationBase.type, context);
            checkNodes(functionLikeDeclarationBase.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.CallSignature:
            const callSignatureDeclaration = node;
            checkNode(callSignatureDeclaration.name, context);
            checkNodes(callSignatureDeclaration.parameters, context);
            checkNode(callSignatureDeclaration.questionToken, context);
            checkNode(callSignatureDeclaration.type, context);
            checkNodes(callSignatureDeclaration.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.ConstructSignature:
            const constructSignatureDeclaration = node;
            checkNode(constructSignatureDeclaration.name, context);
            checkNodes(constructSignatureDeclaration.parameters, context);
            checkNode(constructSignatureDeclaration.questionToken, context);
            checkNode(constructSignatureDeclaration.type, context);
            checkNodes(constructSignatureDeclaration.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.IndexSignature:
            const indexSignatureDeclaration = node;
            checkNode(indexSignatureDeclaration.name, context);
            checkNodes(indexSignatureDeclaration.parameters, context);
            checkNode(indexSignatureDeclaration.questionToken, context);
            checkNode(indexSignatureDeclaration.type, context);
            checkNodes(indexSignatureDeclaration.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.TypePredicate:
            const typePredicateNode = node;
            checkNode(typePredicateNode.type, context);
            checkNode(typePredicateNode.parameterName, context);
            break;
        case typescript_1.default.SyntaxKind.TypeReference:
            const typeReferenceNode = node;
            checkNode(typeReferenceNode.typeName, context);
            checkNodes(typeReferenceNode.typeArguments, context);
            break;
        case typescript_1.default.SyntaxKind.FunctionType:
        case typescript_1.default.SyntaxKind.ConstructorType:
            const signatureDeclarationBase = node;
            checkNode(signatureDeclarationBase.name, context);
            checkNodes(signatureDeclarationBase.parameters, context);
            checkNode(signatureDeclarationBase.type, context);
            checkNodes(signatureDeclarationBase.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.TypeQuery:
            const typeQueryNode = node;
            checkNode(typeQueryNode.exprName, context);
            break;
        case typescript_1.default.SyntaxKind.TypeLiteral:
            const typeLiteralNode = node;
            checkNodes(typeLiteralNode.members, context);
            break;
        case typescript_1.default.SyntaxKind.ArrayType:
            const arrayTypeNode = node;
            checkNode(arrayTypeNode.elementType, context);
            break;
        case typescript_1.default.SyntaxKind.TupleType:
            const tupleTypeNode = node;
            checkNodes(tupleTypeNode.elementTypes, context);
            break;
        case typescript_1.default.SyntaxKind.OptionalType:
            break;
        case typescript_1.default.SyntaxKind.RestType:
            const restTypeNode = node;
            checkNode(restTypeNode.type, context);
            break;
        case typescript_1.default.SyntaxKind.UnionType:
            const unionTypeNode = node;
            checkNodes(unionTypeNode.types, context);
            break;
        case typescript_1.default.SyntaxKind.IntersectionType:
            const intersectionTypeNode = node;
            checkNodes(intersectionTypeNode.types, context);
            break;
        case typescript_1.default.SyntaxKind.ConditionalType:
            const conditionalTypeNode = node;
            checkNode(conditionalTypeNode.checkType, context);
            checkNode(conditionalTypeNode.extendsType, context);
            checkNode(conditionalTypeNode.trueType, context);
            checkNode(conditionalTypeNode.falseType, context);
            break;
        case typescript_1.default.SyntaxKind.InferType:
            const inferTypeNode = node;
            checkNode(inferTypeNode.typeParameter, context);
            break;
        case typescript_1.default.SyntaxKind.ParenthesizedType:
            const parenthesizedTypeNode = node;
            checkNode(parenthesizedTypeNode.type, context);
            break;
        case typescript_1.default.SyntaxKind.ThisType:
            break;
        case typescript_1.default.SyntaxKind.TypeOperator:
            const typeOperatorNode = node;
            checkNode(typeOperatorNode.type, context);
            break;
        case typescript_1.default.SyntaxKind.IndexedAccessType:
            const indexedAccessTypeNode = node;
            checkNode(indexedAccessTypeNode.objectType, context);
            checkNode(indexedAccessTypeNode.indexType, context);
            break;
        case typescript_1.default.SyntaxKind.MappedType:
            const mappedTypeNode = node;
            checkNode(mappedTypeNode.questionToken, context);
            checkNode(mappedTypeNode.readonlyToken, context);
            checkNode(mappedTypeNode.type, context);
            checkNode(mappedTypeNode.typeParameter, context);
            break;
        case typescript_1.default.SyntaxKind.LiteralType:
            const literalTypeNode = node;
            checkNode(literalTypeNode.literal, context);
            break;
        case typescript_1.default.SyntaxKind.ImportType:
            const importTypeNode = node;
            checkNode(importTypeNode.qualifier, context);
            checkNode(importTypeNode.argument, context);
            checkNodes(importTypeNode.typeArguments, context);
            break;
        case typescript_1.default.SyntaxKind.ObjectBindingPattern:
            const objectBindingPattern = node;
            checkNodes(objectBindingPattern.elements, context);
            break;
        case typescript_1.default.SyntaxKind.ArrayBindingPattern:
            const arrayBindingPattern = node;
            checkNodes(arrayBindingPattern.elements, context);
            break;
        case typescript_1.default.SyntaxKind.BindingElement:
            const bindingElement = node;
            checkNode(bindingElement.name, context);
            checkNode(bindingElement.initializer, context);
            checkNode(bindingElement.dotDotDotToken, context);
            checkNode(bindingElement.propertyName, context);
            break;
        case typescript_1.default.SyntaxKind.ArrayLiteralExpression:
            const arrayLiteralExpression = node;
            checkNodes(arrayLiteralExpression.elements, context);
            break;
        case typescript_1.default.SyntaxKind.ObjectLiteralExpression:
            const objectLiteralExpression = node;
            checkNodes(objectLiteralExpression.properties, context);
            break;
        case typescript_1.default.SyntaxKind.PropertyAccessExpression:
            const propertyAccessExpression = node;
            checkNode(propertyAccessExpression.expression, context);
            checkNode(propertyAccessExpression.name, context);
            break;
        case typescript_1.default.SyntaxKind.ElementAccessExpression:
            const elementAccessExpression = node;
            checkNode(elementAccessExpression.expression, context);
            checkNode(elementAccessExpression.argumentExpression, context);
            break;
        case typescript_1.default.SyntaxKind.CallExpression:
            const callExpression = node;
            checkNode(callExpression.expression, context);
            checkNodes(callExpression.arguments, context);
            checkNodes(callExpression.typeArguments, context);
            break;
        case typescript_1.default.SyntaxKind.NewExpression:
            const newExpression = node;
            checkNode(newExpression.expression, context);
            checkNodes(newExpression.arguments, context);
            checkNodes(newExpression.typeArguments, context);
            break;
        case typescript_1.default.SyntaxKind.TaggedTemplateExpression:
            const taggedTemplateExpression = node;
            checkNode(taggedTemplateExpression.template, context);
            break;
        case typescript_1.default.SyntaxKind.TypeAssertionExpression:
            const typeAssertion = node;
            checkNode(typeAssertion.expression, context);
            checkNode(typeAssertion.type, context);
            break;
        case typescript_1.default.SyntaxKind.ParenthesizedExpression:
            const parenthesizedExpression = node;
            checkNode(parenthesizedExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.FunctionExpression:
            const functionExpression = node;
            checkNode(functionExpression.name, context);
            checkNodes(functionExpression.parameters, context);
            checkNode(functionExpression.body, context);
            checkNode(functionExpression.asteriskToken, context);
            checkNode(functionExpression.questionToken, context);
            checkNode(functionExpression.type, context);
            checkNodes(functionExpression.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.ArrowFunction:
            const arrowFunction = node;
            checkNode(arrowFunction.name, context);
            checkNodes(arrowFunction.parameters, context);
            checkNode(arrowFunction.body, context);
            checkNode(arrowFunction.asteriskToken, context);
            checkNode(arrowFunction.questionToken, context);
            checkNode(arrowFunction.type, context);
            checkNodes(arrowFunction.typeParameters, context);
            checkNode(arrowFunction.equalsGreaterThanToken, context);
            break;
        case typescript_1.default.SyntaxKind.DeleteExpression:
            const deleteExpression = node;
            checkNode(deleteExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.TypeOfExpression:
            const typeOfExpression = node;
            checkNode(typeOfExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.VoidExpression:
            const voidExpression = node;
            checkNode(voidExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.AwaitExpression:
            const awaitExpression = node;
            checkNode(awaitExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.PrefixUnaryExpression:
            const prefixUnaryExpression = node;
            checkNode(prefixUnaryExpression.operand, context);
            break;
        case typescript_1.default.SyntaxKind.PostfixUnaryExpression:
            const postfixUnaryExpression = node;
            checkNode(postfixUnaryExpression.operand, context);
            break;
        case typescript_1.default.SyntaxKind.BinaryExpression:
            const binaryExpression = node;
            checkNode(binaryExpression.left, context);
            checkNode(binaryExpression.right, context);
            checkNode(binaryExpression.operatorToken, context);
            break;
        case typescript_1.default.SyntaxKind.ConditionalExpression:
            const conditionalExpression = node;
            checkNode(conditionalExpression.condition, context);
            checkNode(conditionalExpression.colonToken, context);
            checkNode(conditionalExpression.questionToken, context);
            checkNode(conditionalExpression.whenTrue, context);
            checkNode(conditionalExpression.whenFalse, context);
            break;
        case typescript_1.default.SyntaxKind.TemplateExpression:
            const templateExpression = node;
            checkNodes(templateExpression.templateSpans, context);
            break;
        case typescript_1.default.SyntaxKind.YieldExpression:
            const yieldExpression = node;
            checkNode(yieldExpression.asteriskToken, context);
            checkNode(yieldExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.SpreadElement:
            const spreadElement = node;
            checkNode(spreadElement.expression, context);
            break;
        case typescript_1.default.SyntaxKind.ClassExpression:
            const classExpression = node;
            checkNode(classExpression.name, context);
            checkNodes(classExpression.typeParameters, context);
            checkNodes(classExpression.members, context);
            checkNodes(classExpression.heritageClauses, context);
            break;
        case typescript_1.default.SyntaxKind.OmittedExpression:
            break;
        case typescript_1.default.SyntaxKind.ExpressionWithTypeArguments:
            const expressionWithTypeArguments = node;
            checkNode(expressionWithTypeArguments.expression, context);
            checkNodes(expressionWithTypeArguments.typeArguments, context);
            break;
        case typescript_1.default.SyntaxKind.AsExpression:
            const asExpression = node;
            checkNode(asExpression.expression, context);
            checkNode(asExpression.type, context);
            break;
        case typescript_1.default.SyntaxKind.NonNullExpression:
            const nonNullExpression = node;
            checkNode(nonNullExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.MetaProperty:
            const metaProperty = node;
            checkNode(metaProperty.name, context);
            break;
        case typescript_1.default.SyntaxKind.TemplateSpan:
            const templateSpan = node;
            checkNode(templateSpan.expression, context);
            checkNode(templateSpan.literal, context);
            break;
        case typescript_1.default.SyntaxKind.SemicolonClassElement:
            const semicolonClassElement = node;
            checkNode(semicolonClassElement.name, context);
            break;
        case typescript_1.default.SyntaxKind.Block:
            const block = node;
            checkNodes(block.statements, context);
            break;
        case typescript_1.default.SyntaxKind.VariableStatement:
            const variableStatement = node;
            checkNode(variableStatement.declarationList, context);
            break;
        case typescript_1.default.SyntaxKind.EmptyStatement:
            break;
        case typescript_1.default.SyntaxKind.ExpressionStatement:
            const expressionStatement = node;
            checkNode(expressionStatement.expression, context);
            break;
        case typescript_1.default.SyntaxKind.IfStatement:
            const ifStatement = node;
            checkNode(ifStatement.expression, context);
            checkNode(ifStatement.thenStatement, context);
            checkNode(ifStatement.elseStatement, context);
            break;
        case typescript_1.default.SyntaxKind.DoStatement:
            const doStatement = node;
            checkNode(doStatement.expression, context);
            checkNode(doStatement.statement, context);
            break;
        case typescript_1.default.SyntaxKind.WhileStatement:
            const whileStatement = node;
            checkNode(whileStatement.statement, context);
            checkNode(whileStatement.expression, context);
            break;
        case typescript_1.default.SyntaxKind.ForStatement:
            const forStatement = node;
            checkNode(forStatement.initializer, context);
            checkNode(forStatement.condition, context);
            checkNode(forStatement.incrementor, context);
            checkNode(forStatement.statement, context);
            break;
        case typescript_1.default.SyntaxKind.ForInStatement:
            const forInStatement = node;
            checkNode(forInStatement.initializer, context);
            checkNode(forInStatement.expression, context);
            checkNode(forInStatement.statement, context);
            break;
        case typescript_1.default.SyntaxKind.ForOfStatement:
            const forOfStatement = node;
            checkNode(forOfStatement.initializer, context);
            checkNode(forOfStatement.statement, context);
            checkNode(forOfStatement.expression, context);
            checkNode(forOfStatement.awaitModifier, context);
            break;
        case typescript_1.default.SyntaxKind.ContinueStatement:
        case typescript_1.default.SyntaxKind.BreakStatement:
            break;
        case typescript_1.default.SyntaxKind.ReturnStatement:
            const returnStatement = node;
            checkNode(returnStatement.expression, context);
            break;
        case typescript_1.default.SyntaxKind.WithStatement:
            const withStatement = node;
            checkNode(withStatement.expression, context);
            checkNode(withStatement.statement, context);
            break;
        case typescript_1.default.SyntaxKind.SwitchStatement:
            const switchStatement = node;
            checkNode(switchStatement.expression, context);
            checkNode(switchStatement.caseBlock, context);
            break;
        case typescript_1.default.SyntaxKind.LabeledStatement:
            const labeledStatement = node;
            checkNode(labeledStatement.label, context);
            checkNode(labeledStatement.statement, context);
            break;
        case typescript_1.default.SyntaxKind.ThrowStatement:
            const throwStatement = node;
            checkNode(throwStatement.expression, context);
            break;
        case typescript_1.default.SyntaxKind.TryStatement:
            const tryStatement = node;
            checkNode(tryStatement.tryBlock, context);
            checkNode(tryStatement.catchClause, context);
            checkNode(tryStatement.finallyBlock, context);
            break;
        case typescript_1.default.SyntaxKind.DebuggerStatement:
            break;
        case typescript_1.default.SyntaxKind.VariableDeclaration:
            const variableDeclaration = node;
            checkNode(variableDeclaration.name, context);
            checkNode(variableDeclaration.type, context);
            checkNode(variableDeclaration.initializer, context);
            break;
        case typescript_1.default.SyntaxKind.VariableDeclarationList:
            const declarationList = node;
            checkNodes(declarationList.declarations, context);
            break;
        case typescript_1.default.SyntaxKind.FunctionDeclaration:
            const functionDeclaration = node;
            checkNode(functionDeclaration.name, context);
            checkNodes(functionDeclaration.parameters, context);
            checkNode(functionDeclaration.body, context);
            checkNode(functionDeclaration.asteriskToken, context);
            checkNode(functionDeclaration.questionToken, context);
            checkNode(functionDeclaration.type, context);
            checkNodes(functionDeclaration.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.ClassDeclaration:
            const classDeclaration = node;
            checkNode(classDeclaration.name, context);
            checkNodes(classDeclaration.members, context);
            checkNodes(classDeclaration.typeParameters, context);
            checkNodes(classDeclaration.heritageClauses, context);
            break;
        case typescript_1.default.SyntaxKind.InterfaceDeclaration:
            const interfaceDeclaration = node;
            checkNode(interfaceDeclaration.name, context);
            checkNodes(interfaceDeclaration.members, context);
            checkNodes(interfaceDeclaration.typeParameters, context);
            checkNodes(interfaceDeclaration.heritageClauses, context);
            break;
        case typescript_1.default.SyntaxKind.TypeAliasDeclaration:
            const typeAliasDeclaration = node;
            checkNode(typeAliasDeclaration.name, context);
            checkNode(typeAliasDeclaration.type, context);
            checkNodes(typeAliasDeclaration.typeParameters, context);
            break;
        case typescript_1.default.SyntaxKind.EnumDeclaration:
            const enumDeclaration = node;
            checkNode(enumDeclaration.name, context);
            checkNodes(enumDeclaration.members, context);
            break;
        case typescript_1.default.SyntaxKind.ModuleDeclaration:
            const moduleDeclaration = node;
            checkNode(moduleDeclaration.name, context);
            checkNode(moduleDeclaration.body, context);
            break;
        case typescript_1.default.SyntaxKind.ModuleBlock:
            const moduleBlock = node;
            checkNodes(moduleBlock.statements, context);
            break;
        case typescript_1.default.SyntaxKind.CaseBlock:
            const caseBlock = node;
            checkNodes(caseBlock.clauses, context);
            break;
        case typescript_1.default.SyntaxKind.NamespaceExportDeclaration:
            const namespaceExportDeclaration = node;
            checkNode(namespaceExportDeclaration.name, context);
            break;
        case typescript_1.default.SyntaxKind.ImportEqualsDeclaration:
            const importEqualsDeclaration = node;
            checkNode(importEqualsDeclaration.name, context);
            checkNode(importEqualsDeclaration.moduleReference, context);
            break;
        case typescript_1.default.SyntaxKind.ImportDeclaration:
            const importDeclaration = node;
            checkNode(importDeclaration.importClause, context);
            checkNode(importDeclaration.moduleSpecifier, context);
            break;
        case typescript_1.default.SyntaxKind.ImportClause:
            const importClause = node;
            checkNode(importClause.name, context);
            checkNode(importClause.namedBindings, context);
            break;
        case typescript_1.default.SyntaxKind.NamespaceImport:
            const namespaceImport = node;
            checkNode(namespaceImport.name, context);
            break;
        case typescript_1.default.SyntaxKind.NamedImports:
            const namedImports = node;
            checkNodes(namedImports.elements, context);
            break;
        case typescript_1.default.SyntaxKind.ImportSpecifier:
            const importSpecifier = node;
            checkNode(importSpecifier.name, context);
            checkNode(importSpecifier.propertyName, context);
            break;
        case typescript_1.default.SyntaxKind.ExportAssignment:
            const exportAssignment = node;
            checkNode(exportAssignment.name, context);
            checkNode(exportAssignment.expression, context);
            break;
        case typescript_1.default.SyntaxKind.ExportDeclaration:
            const exportDeclaration = node;
            checkNode(exportDeclaration.exportClause, context);
            checkNode(exportDeclaration.name, context);
            checkNode(exportDeclaration.moduleSpecifier, context);
            break;
        case typescript_1.default.SyntaxKind.NamedExports:
            const namedExports = node;
            checkNodes(namedExports.elements, context);
            break;
        case typescript_1.default.SyntaxKind.ExportSpecifier:
            const exportSpecifier = node;
            checkNode(exportSpecifier.name, context);
            checkNode(exportSpecifier.propertyName, context);
            break;
        case typescript_1.default.SyntaxKind.MissingDeclaration:
            const missingDeclaration = node;
            checkNode(missingDeclaration.name, context);
            break;
        case typescript_1.default.SyntaxKind.ExternalModuleReference:
            const externalModuleReference = node;
            checkNode(externalModuleReference.expression, context);
            break;
        case typescript_1.default.SyntaxKind.JsxElement:
            const jsxElement = node;
            checkNode(jsxElement.openingElement, context);
            checkNode(jsxElement.closingElement, context);
            checkNodes(jsxElement.children, context);
            break;
        case typescript_1.default.SyntaxKind.JsxSelfClosingElement:
            const jsxSelfClosingElement = node;
            checkNode(jsxSelfClosingElement.attributes, context);
            checkNode(jsxSelfClosingElement.tagName, context);
            break;
        case typescript_1.default.SyntaxKind.JsxOpeningElement:
            const jsxOpeningElement = node;
            checkNode(jsxOpeningElement.attributes, context);
            checkNode(jsxOpeningElement.tagName, context);
            break;
        case typescript_1.default.SyntaxKind.JsxClosingElement:
            const jsxClosingElement = node;
            checkNode(jsxClosingElement.tagName, context);
            break;
        case typescript_1.default.SyntaxKind.JsxFragment:
            const jsxFragment = node;
            checkNode(jsxFragment.openingFragment, context);
            checkNode(jsxFragment.closingFragment, context);
            checkNodes(jsxFragment.children, context);
            break;
        case typescript_1.default.SyntaxKind.JsxOpeningFragment:
            break;
        case typescript_1.default.SyntaxKind.JsxClosingFragment:
            break;
        case typescript_1.default.SyntaxKind.JsxAttribute:
            const jsxAttribute = node;
            checkNode(jsxAttribute.name, context);
            checkNode(jsxAttribute.initializer, context);
            break;
        case typescript_1.default.SyntaxKind.JsxAttributes:
            const jsxAttributes = node;
            checkNodes(jsxAttributes.properties, context);
            break;
        case typescript_1.default.SyntaxKind.JsxSpreadAttribute:
            const jsxSpreadAttribute = node;
            checkNode(jsxSpreadAttribute.name, context);
            checkNode(jsxSpreadAttribute.expression, context);
            break;
        case typescript_1.default.SyntaxKind.JsxExpression:
            const jsxExpression = node;
            checkNode(jsxExpression.dotDotDotToken, context);
            checkNode(jsxExpression.expression, context);
            break;
        case typescript_1.default.SyntaxKind.CaseClause:
            const caseClause = node;
            checkNodes(caseClause.statements, context);
            checkNode(caseClause.expression, context);
            break;
        case typescript_1.default.SyntaxKind.DefaultClause:
            const defaultClause = node;
            checkNodes(defaultClause.statements, context);
            break;
        case typescript_1.default.SyntaxKind.HeritageClause:
            const heritageClause = node;
            checkNodes(heritageClause.types, context);
            break;
        case typescript_1.default.SyntaxKind.CatchClause:
            const catchClause = node;
            if (context.ignoreCatch) {
                const copyContext = Object.assign({}, context);
                copyContext.catchVariables = Object.assign({}, context.catchVariables);
                if (catchClause.variableDeclaration) {
                    const decl = catchClause.variableDeclaration;
                    if (decl.name.kind === typescript_1.default.SyntaxKind.Identifier) {
                        copyContext.catchVariables[decl.name.escapedText] = true;
                    }
                }
                checkNode(catchClause.variableDeclaration, copyContext);
            }
            else {
                checkNode(catchClause.block, context);
                checkNode(catchClause.variableDeclaration, context);
            }
            break;
        case typescript_1.default.SyntaxKind.PropertyAssignment:
            const propertyAssignmentExpression = node;
            checkNode(propertyAssignmentExpression.name, context);
            checkNode(propertyAssignmentExpression.questionToken, context);
            checkNode(propertyAssignmentExpression.initializer, context);
            break;
        case typescript_1.default.SyntaxKind.ShorthandPropertyAssignment:
            const shorthandPropertyAssignment = node;
            checkNode(shorthandPropertyAssignment.name, context);
            checkNode(shorthandPropertyAssignment.questionToken, context);
            checkNode(shorthandPropertyAssignment.equalsToken, context);
            checkNode(shorthandPropertyAssignment.objectAssignmentInitializer, context);
            break;
        case typescript_1.default.SyntaxKind.SpreadAssignment:
            const spreadAssignment = node;
            checkNode(spreadAssignment.name, context);
            checkNode(spreadAssignment.expression, context);
            break;
        case typescript_1.default.SyntaxKind.EnumMember:
        case typescript_1.default.SyntaxKind.SourceFile:
        case typescript_1.default.SyntaxKind.Bundle:
        case typescript_1.default.SyntaxKind.JSDocTypeExpression:
        case typescript_1.default.SyntaxKind.JSDocAllType:
        case typescript_1.default.SyntaxKind.JSDocUnknownType:
        case typescript_1.default.SyntaxKind.JSDocNullableType:
        case typescript_1.default.SyntaxKind.JSDocNonNullableType:
        case typescript_1.default.SyntaxKind.JSDocOptionalType:
        case typescript_1.default.SyntaxKind.JSDocFunctionType:
        case typescript_1.default.SyntaxKind.JSDocVariadicType:
        case typescript_1.default.SyntaxKind.JSDocComment:
        case typescript_1.default.SyntaxKind.JSDocTag:
        case typescript_1.default.SyntaxKind.JSDocAugmentsTag:
        case typescript_1.default.SyntaxKind.JSDocClassTag:
        case typescript_1.default.SyntaxKind.JSDocParameterTag:
        case typescript_1.default.SyntaxKind.JSDocReturnTag:
        case typescript_1.default.SyntaxKind.JSDocTypeTag:
        case typescript_1.default.SyntaxKind.JSDocTemplateTag:
        case typescript_1.default.SyntaxKind.JSDocTypedefTag:
        case typescript_1.default.SyntaxKind.JSDocPropertyTag:
        case typescript_1.default.SyntaxKind.JSDocTypeLiteral:
        case typescript_1.default.SyntaxKind.SyntaxList:
        case typescript_1.default.SyntaxKind.NotEmittedStatement:
        case typescript_1.default.SyntaxKind.PartiallyEmittedExpression:
        case typescript_1.default.SyntaxKind.CommaListExpression:
        case typescript_1.default.SyntaxKind.MergeDeclarationMarker:
        case typescript_1.default.SyntaxKind.EndOfDeclarationMarker:
        case typescript_1.default.SyntaxKind.Count:
            break;
        default:
            console.log(`warning: unhandled node kind: ${node.kind}`);
    }
}
exports.checkNode = checkNode;
