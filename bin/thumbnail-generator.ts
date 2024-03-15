#!/usr/bin/env node
import 'source-map-support/register';
import { App, Stack } from 'aws-cdk-lib';                 // core constructs
import { ThumbnailGeneratorStack } from '../lib/thumbnail-generator-stack';

const app = new App();
new ThumbnailGeneratorStack(app, 'ThumbnailGeneratorStack');
