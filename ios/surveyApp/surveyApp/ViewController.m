//
//  ViewController.m
//  surveyApp
//
//  Created by Manit on 1/20/15.
//  Copyright (c) 2015 ASU. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController
@synthesize webview;


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    NSString *path = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"dist"];
    NSURL *url = [NSURL fileURLWithPath:path];
    NSURLRequest *req = [NSURLRequest requestWithURL:url];
//    NSString *html = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
//    [webview loadRequest:req];
//    [webview loadHTMLString:html baseURL:[url]];
    [webview loadRequest:req];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
