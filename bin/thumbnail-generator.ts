#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ThumbnailGeneratorStack } from '../lib/thumbnail-generator-stack';

const app = new cdk.App();
new ThumbnailGeneratorStack(app, 'ThumbnailGeneratorStack');
