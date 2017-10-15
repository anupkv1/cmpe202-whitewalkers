import java.util.Arrays;
import java.util.List;
import java.util.function.BinaryOperator;

public class Duplication {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        Integer product = Math2.sum(numbers);
        System.out.println(product);
    }
}

//with duplication
class Math1 {
    public static Integer sum(List<Integer> numbers) {
        Integer sum = 0;
        for (Integer n : numbers) {
            sum += n;
        }
        return sum;
    }

    public static Integer multiply(List<Integer> numbers) {
        Integer product = 1;
        for (Integer n : numbers) {
            product *= n;
        }
        return product;
    }
}


//after refactor with lambda
class Math2 {

    public static Integer reduce(List<Integer> numbers, Integer unit, BinaryOperator<Integer> operator) {
        Integer result = unit;
        for (Integer n : numbers) {
            result = operator.apply(result, n);
        }
        return result;
    }

    public static Integer sum(List<Integer> numbers) {
        return reduce(numbers, 0, (x, y) -> x + y);
    }

    public static Integer multiply(List<Integer> numbers) {
        return reduce(numbers, 1, (x, y) -> x * y);
    }
}
