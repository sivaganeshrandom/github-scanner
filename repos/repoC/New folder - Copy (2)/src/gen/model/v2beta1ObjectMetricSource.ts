/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1.21.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';
import { V1LabelSelector } from './v1LabelSelector';
import { V2beta1CrossVersionObjectReference } from './v2beta1CrossVersionObjectReference';

/**
* ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).
*/
export class V2beta1ObjectMetricSource {
    /**
    * averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
    */
    'averageValue'?: string;
    /**
    * metricName is the name of the metric in question.
    */
    'metricName': string;
    'selector'?: V1LabelSelector;
    'target': V2beta1CrossVersionObjectReference;
    /**
    * targetValue is the target value of the metric (as a quantity).
    */
    'targetValue': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "averageValue",
            "baseName": "averageValue",
            "type": "string"
        },
        {
            "name": "metricName",
            "baseName": "metricName",
            "type": "string"
        },
        {
            "name": "selector",
            "baseName": "selector",
            "type": "V1LabelSelector"
        },
        {
            "name": "target",
            "baseName": "target",
            "type": "V2beta1CrossVersionObjectReference"
        },
        {
            "name": "targetValue",
            "baseName": "targetValue",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return V2beta1ObjectMetricSource.attributeTypeMap;
    }
}

