import {Injectable, Pipe} from 'angular2/angular2';

@Pipe({
  name: '<%= fileAndClassName %>'
})
@Injectable()
class <%= javascriptClassName %> {
  transform(v, args) { 
    return v.toLowerCase(); 
  }
}
