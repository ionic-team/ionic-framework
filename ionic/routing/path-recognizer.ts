import {
  RegExp,
  RegExpWrapper,
  RegExpMatcherWrapper,
  StringWrapper,
  isPresent,
  isBlank,
  BaseException,
  normalizeBlank
} from 'angular2/src/facade/lang';
import {
  Map,
  MapWrapper,
  StringMap,
  StringMapWrapper,
  List,
  ListWrapper
} from 'angular2/src/facade/collection';


class ContinuationSegment {
  generate(params) {
    return '';
  }
}

class StaticSegment {
  constructor(string) {
    this.name = '';
    this.regex = escapeRegex(string);
  }

  generate() {
    return this.regex;
  }
}

class DynamicSegment {
  constructor(name) {
    this.regex = "([^/]+)";
  }

  generate(params) {
    if (!StringMapWrapper.contains(params, this.name)) {
      throw new BaseException(
          `Route generator for '${this.name}' was not included in parameters passed.`)
    }
    return normalizeBlank(StringMapWrapper.get(params, this.name));
  }
}

class StarSegment {
  constructor(name) {
    this.regex = "(.+)";
  }

  generate(params) {
    return normalizeBlank(StringMapWrapper.get(params, this.name));
  }
}


var paramMatcher = RegExpWrapper.create("^:([^\/]+)$");
var wildcardMatcher = RegExpWrapper.create("^\\*([^\/]+)$");

function parsePathString(route: string) {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (StringWrapper.startsWith(route, "/")) {
    route = StringWrapper.substring(route, 1);
  }

  var segments = splitBySlash(route);
  var results = [];
  var specificity = 0;

  // The "specificity" of a path is used to determine which route is used when multiple routes match
  // a URL.
  // Static segments (like "/foo") are the most specific, followed by dynamic segments (like
  // "/:id"). Star segments
  // add no specificity. Segments at the start of the path are more specific than proceeding ones.
  // The code below uses place values to combine the different types of segments into a single
  // integer that we can
  // sort later. Each static segment is worth hundreds of points of specificity (10000, 9900, ...,
  // 200), and each
  // dynamic segment is worth single points of specificity (100, 99, ... 2).
  if (segments.length > 98) {
    throw new BaseException(`'${route}' has more than the maximum supported number of segments.`);
  }

  var limit = segments.length - 1;
  for (var i = 0; i <= limit; i++) {
    var segment = segments[i], match;

    if (isPresent(match = RegExpWrapper.firstMatch(paramMatcher, segment))) {
      results.push(new DynamicSegment(match[1]));
      specificity += (100 - i);
    } else if (isPresent(match = RegExpWrapper.firstMatch(wildcardMatcher, segment))) {
      results.push(new StarSegment(match[1]));
    } else if (segment == '...') {
      if (i < limit) {
        // TODO (matsko): setup a proper error here `
        throw new BaseException(`Unexpected "..." before the end of the path for "${route}".`);
      }
      results.push(new ContinuationSegment());
    } else if (segment.length > 0) {
      results.push(new StaticSegment(segment));
      specificity += 100 * (100 - i);
    }
  }

  return {segments: results, specificity};
}

function splitBySlash(url: string): List<string> {
  return url.split('/');
}


// represents something like '/foo/:bar'
export class PathRecognizer {

  constructor(path) {
    this.segments = [];

    var parsed = parsePathString(path);
    var specificity = parsed['specificity'];
    var segments = parsed['segments'];
    var regexString = '^';

    ListWrapper.forEach(segments, (segment) => {
      if (segment instanceof ContinuationSegment) {
        this.terminal = false;
      } else {
        regexString += '/' + segment.regex;
      }
    });

    if (this.terminal) {
      regexString += '$';
    }

    this.regex = RegExpWrapper.create(regexString);
    this.segments = segments;
    this.specificity = specificity;
  }

  parseParams(url) {
    var params = StringMapWrapper.create();
    var urlPart = url;
    for (var i = 0; i < this.segments.length; i++) {
      var segment = this.segments[i];
      if (segment instanceof ContinuationSegment) {
        continue;
      }

      var match = RegExpWrapper.firstMatch(RegExpWrapper.create('/' + segment.regex), urlPart);
      urlPart = StringWrapper.substring(urlPart, match[0].length);
      if (segment.name.length > 0) {
        StringMapWrapper.set(params, segment.name, match[1]);
      }
    }

    return params;
  }

  generate(params) {
    return ListWrapper.join(
        ListWrapper.map(this.segments, (segment) => '/' + segment.generate(params)), '');
  }
}

var specialCharacters = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
var escapeRe = RegExpWrapper.create('(\\' + specialCharacters.join('|\\') + ')', 'g');

function escapeRegex(string): string {
  return StringWrapper.replaceAllMapped(string, escapeRe, (match) => { return "\\" + match; });
}
